import axios, { AxiosInstance } from 'axios';
import * as fs from 'node:fs';
import * as path from 'node:path';

const QASE_API_BASE = 'https://api.qase.io/v1';
const NEW_CASES_SECTION_NAME = 'New test cases';
const RESULTS_FILE = path.join(process.cwd(), '.qase-results.json');

/** Remove leading case id from title for Qase (e.g. `[203]`, `[PAS-203]`, `[PAS-1, PAS-2]`). */
function stripCaseIdPrefixFromTitle(title: string): string {
  return title
    .replace(/^\[PAS-XXX\]\s*/i, '')
    .replace(/^\[(?:PAS-\d+|\d+)(?:\s*,\s*(?:PAS-\d+|\d+))*\]\s*/, '')
    .trim();
}

interface QasePlanCase {
  case_id: number;
  assignee?: number;
}

interface TestResult {
  caseId: number;
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
}

interface SyncState {
  qaseCaseIds: Set<number>;
  automationCases: Map<number, string>;
  automationCasesWithoutId: string[];
  executedResults: Map<number, TestResult>;
  executedResultsWithoutId: Map<string, TestResult>;
  runId: number | null;
  sectionId: number | null;
}

const state: SyncState = {
  qaseCaseIds: new Set(),
  automationCases: new Map(),
  automationCasesWithoutId: [],
  executedResults: new Map(),
  executedResultsWithoutId: new Map(),
  runId: null,
  sectionId: null,
};

function getConfig() {
  return {
    apiToken: process.env.QASE_API_TOKEN || '',
    projectCode: process.env.QASE_PROJECT_CODE || 'PAS',
    planId: Number(process.env.QASE_TESTOPS_PLAN_ID || process.env.QASE_PLAN_ID || '0'),
    /** Repository suite (folder) id from Qase URL, e.g. .../project/PAS?suite=25 */
    suiteId: Number(process.env.QASE_SUITE_ID || '0'),
    runId: Number(process.env.QASE_RUN_ID || '0'),
    enabled: process.env.ENABLE_QASE === 'true',
    syncEnabled: process.env.QASE_SYNC !== 'false',
  };
}

function createApiClient(): AxiosInstance {
  const config = getConfig();
  return axios.create({
    baseURL: QASE_API_BASE,
    headers: {
      'Token': config.apiToken,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });
}

export async function fetchPlanCases(): Promise<number[]> {
  const config = getConfig();
  if (!config.enabled || config.planId === 0) {
    console.log('📋 QASE sync: No plan ID configured, skipping plan fetch');
    return [];
  }

  const api = createApiClient();
  
  try {
    console.log(`📋 Fetching cases from QASE Test Plan ID: ${config.planId}`);
    
    const response = await api.get(`/plan/${config.projectCode}/${config.planId}`);
    
    if (response.data?.status && response.data.result?.cases) {
      const cases: QasePlanCase[] = response.data.result.cases;
      const caseIds = cases.map(c => c.case_id);
      
      state.qaseCaseIds = new Set(caseIds);
      console.log(`   Found ${caseIds.length} cases in plan: [${caseIds.slice(0, 10).join(', ')}${caseIds.length > 10 ? '...' : ''}]`);
      
      return caseIds;
    }
    
    console.warn('⚠️ Unexpected response format from QASE API');
    return [];
  } catch (error: any) {
    console.error('❌ Failed to fetch QASE plan cases:', error.response?.data || error.message);
    return [];
  }
}

/**
 * Load case IDs from a repository suite (folder), e.g. suite=25 in
 * https://app.qase.io/project/PAS?suite=25
 * Uses GET /case with suite_id + pagination.
 */
export async function fetchSuiteCases(suiteId: number): Promise<number[]> {
  const config = getConfig();
  if (!config.enabled || suiteId <= 0) {
    return [];
  }

  const api = createApiClient();
  const caseIds: number[] = [];
  let offset = 0;
  const limit = 100;

  try {
    console.log(`📋 Fetching cases from QASE repository suite ID: ${suiteId}`);

    while (true) {
      const response = await api.get(`/case/${config.projectCode}`, {
        params: {
          suite_id: suiteId,
          limit,
          offset,
        },
      });

      const entities = response.data?.result?.entities;
      if (!response.data?.status || !Array.isArray(entities)) {
        console.warn('⚠️ Unexpected response format from QASE case list API');
        break;
      }

      for (const entity of entities) {
        const num = entity.case_id ?? entity.id;
        if (typeof num === 'number' && num > 0) {
          caseIds.push(num);
        }
      }

      const total = response.data?.result?.total ?? 0;
      const count = entities.length;
      offset += count;

      if (count < limit || offset >= total || count === 0) {
        break;
      }
    }

    state.qaseCaseIds = new Set(caseIds);
    console.log(
      `   Found ${caseIds.length} cases in suite ${suiteId}: [${caseIds.slice(0, 10).join(', ')}${caseIds.length > 10 ? '...' : ''}]`
    );

    return caseIds;
  } catch (error: any) {
    console.error('❌ Failed to fetch QASE suite cases:', error.response?.data || error.message);
    return [];
  }
}

export function parseAutomationCases(specsDir: string): Map<number, string> {
  const cases = new Map<number, string>();
  const casesWithoutId: string[] = [];
  
  console.log(`📂 Parsing spec files from: ${specsDir}`);
  
  if (!fs.existsSync(specsDir)) {
    console.warn(`⚠️ Specs directory not found: ${specsDir}`);
    return cases;
  }
  
  const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.ts'));
  
  for (const file of files) {
    const filePath = path.join(specsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const itMatches = content.matchAll(/it\s*\(\s*['"`](.+?)['"`]/g);
    
    for (const match of itMatches) {
      const testTitle = match[1];
      const ids = extractAllCaseIds(testTitle);
      
      if (ids.length > 0) {
        for (const caseId of ids) {
          cases.set(caseId, testTitle);
        }
      } else {
        casesWithoutId.push(testTitle);
      }
    }
  }
  
  state.automationCases = cases;
  state.automationCasesWithoutId = casesWithoutId;
  console.log(`   Found ${cases.size} test cases with IDs in spec files`);
  console.log(`   Found ${casesWithoutId.length} test cases WITHOUT IDs (will create new)`);
  
  return cases;
}

export async function getOrCreateSection(): Promise<number | null> {
  const config = getConfig();
  if (!config.enabled) return null;

  if (config.suiteId > 0) {
    state.sectionId = config.suiteId;
    console.log(`📁 Using QASE repository suite ID ${config.suiteId} for new cases (from QASE_SUITE_ID)`);
    return config.suiteId;
  }
  
  const api = createApiClient();
  
  try {
    const response = await api.get(`/suite/${config.projectCode}`, {
      params: { limit: 100 }
    });
    
    if (response.data?.status && response.data.result?.entities) {
      const sections = response.data.result.entities;
      const existing = sections.find((s: any) => s.title === NEW_CASES_SECTION_NAME);
      
      if (existing) {
        console.log(`📁 Found existing section "${NEW_CASES_SECTION_NAME}" (ID: ${existing.id})`);
        state.sectionId = existing.id;
        return existing.id;
      }
    }
    
    console.log(`📁 Creating new section "${NEW_CASES_SECTION_NAME}"...`);
    const createResponse = await api.post(`/suite/${config.projectCode}`, {
      title: NEW_CASES_SECTION_NAME,
      description: 'Auto-created section for new automated test cases',
    });
    
    if (createResponse.data?.status && createResponse.data.result?.id) {
      const sectionId = createResponse.data.result.id;
      console.log(`   Created section with ID: ${sectionId}`);
      state.sectionId = sectionId;
      return sectionId;
    }
    
    return null;
  } catch (error: any) {
    console.error('❌ Failed to get/create section:', error.response?.data || error.message);
    return null;
  }
}

export async function createCase(title: string, sectionId: number): Promise<number | null> {
  const config = getConfig();
  if (!config.enabled) return null;
  
  const api = createApiClient();
  
  try {
    const cleanTitle = stripCaseIdPrefixFromTitle(title);
    
    const response = await api.post(`/case/${config.projectCode}`, {
      title: cleanTitle,
      suite_id: sectionId,
      automation: 2,  // 0=not automated, 1=to be automated, 2=automated
      status: 0,      // 0=actual, 1=draft, 2=deprecated
      priority: 2,    // 1=high, 2=medium, 3=low
    });
    
    if (response.data?.status && response.data.result?.id) {
      const caseId = response.data.result.id;
      console.log(`   ✅ Created case "${cleanTitle}" (ID: ${caseId})`);
      return caseId;
    }
    
    return null;
  } catch (error: any) {
    console.error(`❌ Failed to create case "${title}":`, error.response?.data || error.message);
    return null;
  }
}

export async function createTestRun(): Promise<number | null> {
  const config = getConfig();
  if (!config.enabled) return null;
  
  if (config.runId > 0) {
    state.runId = config.runId;
    return config.runId;
  }
  
  const api = createApiClient();
  
  try {
    const runTitle = `Automated Run - ${new Date().toISOString().split('T')[0]}`;
    
    const payload: any = {
      title: runTitle,
      is_autotest: true,
    };
    
    if (config.planId > 0) {
      payload.plan_id = config.planId;
    }
    
    const response = await api.post(`/run/${config.projectCode}`, payload);
    
    if (response.data?.status && response.data.result?.id) {
      const runId = response.data.result.id;
      console.log(`🏃 Created Test Run (ID: ${runId})`);
      state.runId = runId;
      return runId;
    }
    
    return null;
  } catch (error: any) {
    console.error('❌ Failed to create test run:', error.response?.data || error.message);
    return null;
  }
}

export async function sendResult(
  runId: number,
  caseId: number,
  status: 'passed' | 'failed' | 'skipped',
  options?: { comment?: string; time_ms?: number; stacktrace?: string }
): Promise<boolean> {
  const config = getConfig();
  if (!config.enabled) return false;
  
  const api = createApiClient();
  
  try {
    const payload: any = {
      case_id: caseId,
      status,
    };
    
    if (options?.comment) payload.comment = options.comment;
    if (options?.time_ms) payload.time_ms = options.time_ms;
    if (options?.stacktrace) payload.stacktrace = options.stacktrace;
    
    await api.post(`/result/${config.projectCode}/${runId}`, payload);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed to send result for case ${caseId}:`, error.response?.data || error.message);
    return false;
  }
}

interface BulkResultItem {
  case_id: number;
  status: 'passed' | 'failed' | 'skipped';
  comment?: string;
  time_ms?: number;
  stacktrace?: string;
}

const BULK_BATCH_SIZE = 100;

export async function sendBulkResults(
  runId: number,
  results: BulkResultItem[]
): Promise<{ sent: number; errors: number }> {
  const config = getConfig();
  if (!config.enabled) return { sent: 0, errors: 0 };
  
  const api = createApiClient();
  let totalSent = 0;
  let totalErrors = 0;
  
  const totalBatches = Math.ceil(results.length / BULK_BATCH_SIZE);
  
  for (let i = 0; i < results.length; i += BULK_BATCH_SIZE) {
    const batch = results.slice(i, i + BULK_BATCH_SIZE);
    const batchNum = Math.floor(i / BULK_BATCH_SIZE) + 1;
    
    try {
      const response = await api.post(`/result/${config.projectCode}/${runId}/bulk`, {
        results: batch,
      });
      
      if (response.data?.status) {
        totalSent += batch.length;
        console.log(`      Batch ${batchNum}/${totalBatches}: ${batch.length} results sent ✅`);
      } else {
        totalErrors += batch.length;
        console.log(`      Batch ${batchNum}/${totalBatches}: FAILED ❌`);
      }
    } catch (error: any) {
      totalErrors += batch.length;
      console.error(`      Batch ${batchNum}/${totalBatches}: FAILED ❌`, error.response?.data || error.message);
    }
    
    // Small delay between batches to avoid rate limiting
    if (i + BULK_BATCH_SIZE < results.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  return { sent: totalSent, errors: totalErrors };
}

export async function sendAdHocResult(
  runId: number,
  title: string,
  status: 'passed' | 'failed' | 'skipped',
  options?: { comment?: string; time_ms?: number; stacktrace?: string }
): Promise<boolean> {
  const config = getConfig();
  if (!config.enabled) return false;
  
  const api = createApiClient();
  
  try {
    const cleanTitle = stripCaseIdPrefixFromTitle(title);
    
    const payload: any = {
      case: { title: cleanTitle },
      status,
    };
    
    if (options?.comment) payload.comment = options.comment;
    if (options?.time_ms) payload.time_ms = options.time_ms;
    if (options?.stacktrace) payload.stacktrace = options.stacktrace;
    
    await api.post(`/result/${config.projectCode}/${runId}`, payload);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed to send ad-hoc result for "${title}":`, error.response?.data || error.message);
    return false;
  }
}

interface BulkAdHocResultItem {
  case: { title: string };
  status: 'passed' | 'failed' | 'skipped';
  comment?: string;
  time_ms?: number;
  stacktrace?: string;
}

export async function sendBulkAdHocResults(
  runId: number,
  results: BulkAdHocResultItem[]
): Promise<{ sent: number; errors: number }> {
  const config = getConfig();
  if (!config.enabled) return { sent: 0, errors: 0 };
  
  const api = createApiClient();
  let totalSent = 0;
  let totalErrors = 0;
  
  const totalBatches = Math.ceil(results.length / BULK_BATCH_SIZE);
  
  for (let i = 0; i < results.length; i += BULK_BATCH_SIZE) {
    const batch = results.slice(i, i + BULK_BATCH_SIZE);
    const batchNum = Math.floor(i / BULK_BATCH_SIZE) + 1;
    
    try {
      const response = await api.post(`/result/${config.projectCode}/${runId}/bulk`, {
        results: batch,
      });
      
      if (response.data?.status) {
        totalSent += batch.length;
        console.log(`      Batch ${batchNum}/${totalBatches}: ${batch.length} ad-hoc results sent ✅`);
      } else {
        totalErrors += batch.length;
        console.log(`      Batch ${batchNum}/${totalBatches}: FAILED ❌`);
      }
    } catch (error: any) {
      totalErrors += batch.length;
      console.error(`      Batch ${batchNum}/${totalBatches}: FAILED ❌`, error.response?.data || error.message);
    }
    
    if (i + BULK_BATCH_SIZE < results.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  return { sent: totalSent, errors: totalErrors };
}

interface FileResults {
  withId: Array<{ caseId: number; title: string; status: 'passed' | 'failed'; duration?: number; error?: string }>;
  withoutId: Array<{ title: string; status: 'passed' | 'failed'; duration?: number; error?: string }>;
}

function loadResultsFromFile(): FileResults {
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      const data = fs.readFileSync(RESULTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    // ignore
  }
  return { withId: [], withoutId: [] };
}

function saveResultToFile(
  caseId: number | null,
  title: string,
  status: 'passed' | 'failed',
  duration?: number,
  error?: string
): void {
  const results = loadResultsFromFile();
  
  if (caseId) {
    const existing = results.withId.findIndex(r => r.caseId === caseId);
    const entry = { caseId, title, status, duration, error };
    if (existing >= 0) {
      results.withId[existing] = entry;
    } else {
      results.withId.push(entry);
    }
  } else {
    const existing = results.withoutId.findIndex(r => r.title === title);
    const entry = { title, status, duration, error };
    if (existing >= 0) {
      results.withoutId[existing] = entry;
    } else {
      results.withoutId.push(entry);
    }
  }
  
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

export function recordTestResult(
  caseIdOrIds: number | number[] | null,
  title: string,
  status: 'passed' | 'failed',
  duration?: number,
  error?: string
): void {
  const caseIds = Array.isArray(caseIdOrIds) ? caseIdOrIds : (caseIdOrIds ? [caseIdOrIds] : []);
  
  if (caseIds.length > 0) {
    for (const caseId of caseIds) {
      saveResultToFile(caseId, title, status, duration, error);
      state.executedResults.set(caseId, {
        caseId,
        title,
        status,
        duration,
        error,
      });
    }
  } else {
    saveResultToFile(null, title, status, duration, error);
    state.executedResultsWithoutId.set(title, {
      caseId: 0,
      title,
      status,
      duration,
      error,
    });
  }
}

export function extractCaseId(testTitle: string): number | null {
  const ids = extractAllCaseIds(testTitle);
  return ids.length > 0 ? ids[0] : null;
}

/** Supports `[123]`, `[PAS-123]`, and comma-separated lists. */
export function extractAllCaseIds(testTitle: string): number[] {
  const match = testTitle.match(/^\[([^\]]+)\]/);
  if (!match) return [];

  const idsString = match[1];
  const ids = idsString
    .split(/[,\s]+/)
    .map(s => s.trim().replace(/^PAS-/i, ''))
    .map(s => parseInt(s, 10))
    .filter(n => !isNaN(n) && n > 0);

  return ids;
}

export async function initSync(specsDir: string): Promise<void> {
  const config = getConfig();
  
  // Clear old results file from previous runs
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      fs.unlinkSync(RESULTS_FILE);
    }
  } catch (e) {
    // ignore
  }
  
  console.log('\n========== QASE SYNC DEBUG ==========');
  console.log(`ENABLE_QASE: ${process.env.ENABLE_QASE}`);
  console.log(`QASE_SYNC: ${process.env.QASE_SYNC}`);
  console.log(`QASE_API_TOKEN: ${config.apiToken ? '***SET***' : 'NOT SET'}`);
  console.log(`QASE_PROJECT_CODE: ${config.projectCode}`);
  console.log(`QASE_TESTOPS_PLAN_ID: ${config.planId}`);
  console.log(`QASE_SUITE_ID: ${config.suiteId || '(not set)'}`);
  console.log(`config.enabled: ${config.enabled}`);
  console.log(`config.syncEnabled: ${config.syncEnabled}`);
  console.log('======================================\n');
  
  if (!config.enabled) {
    console.log('📋 QASE integration disabled');
    return;
  }
  
  if (!config.syncEnabled) {
    console.log('📋 QASE sync disabled (QASE_SYNC=false)');
    return;
  }
  
  if (!config.apiToken) {
    console.error('❌ QASE_API_TOKEN is not set! Sync disabled.');
    return;
  }
  
  if (config.suiteId === 0 && config.planId === 0) {
    console.warn('⚠️ Neither QASE_SUITE_ID nor QASE_TESTOPS_PLAN_ID is set. Cannot fetch Qase case scope.');
  }

  console.log('\n🔄 Initializing QASE sync...');
  
  try {
    if (config.suiteId > 0) {
      await fetchSuiteCases(config.suiteId);
    } else {
      await fetchPlanCases();
    }
    parseAutomationCases(specsDir);
  } catch (error: any) {
    console.error('❌ Error during QASE sync init:', error.message);
  }
  
  const onlyInQase = [...state.qaseCaseIds].filter(id => !state.automationCases.has(id));
  const onlyInAutomation = [...state.automationCases.keys()].filter(id => !state.qaseCaseIds.has(id));
  const inBoth = [...state.automationCases.keys()].filter(id => state.qaseCaseIds.has(id));
  const testsWithoutId = state.automationCasesWithoutId;
  
  console.log('\n📊 Sync Summary:');
  console.log(`   ✅ In both QASE & automation: ${inBoth.length}`);
  console.log(`   ⏭️  Only in QASE (will skip): ${onlyInQase.length}`);
  console.log(`   🆕 With ID but not in QASE (will create in Repository): ${onlyInAutomation.length}`);
  console.log(`   📝 Without ID (ad-hoc results in Test Run): ${testsWithoutId.length}`);
  
  if (onlyInQase.length > 0) {
    console.log(`      QASE-only IDs: [${onlyInQase.slice(0, 10).join(', ')}${onlyInQase.length > 10 ? '...' : ''}]`);
  }
  if (onlyInAutomation.length > 0) {
    console.log(`      Automation-only IDs: [${onlyInAutomation.slice(0, 10).join(', ')}${onlyInAutomation.length > 10 ? '...' : ''}]`);
  }
  if (testsWithoutId.length > 0) {
    console.log(`      Tests without ID (first 5): ${testsWithoutId.slice(0, 5).map(t => `"${t.substring(0, 40)}..."`).join(', ')}`);
  }
  
  console.log('');
}

export async function completeSync(): Promise<void> {
  const config = getConfig();
  
  if (!config.enabled || !config.syncEnabled) {
    return;
  }
  
  console.log('\n🔄 Completing QASE sync...');
  
  // Load results from file (written by worker processes)
  const fileResults = loadResultsFromFile();
  console.log(`📂 Loaded ${fileResults.withId.length} results with ID, ${fileResults.withoutId.length} without ID from workers`);
  
  // Populate state from file
  for (const r of fileResults.withId) {
    state.executedResults.set(r.caseId, {
      caseId: r.caseId,
      title: r.title,
      status: r.status,
      duration: r.duration,
      error: r.error,
    });
  }
  for (const r of fileResults.withoutId) {
    state.executedResultsWithoutId.set(r.title, {
      caseId: 0,
      title: r.title,
      status: r.status,
      duration: r.duration,
      error: r.error,
    });
  }
  
  let runId = state.runId;
  if (!runId) {
    runId = await createTestRun();
    if (!runId) {
      console.error('❌ Cannot complete sync: no run ID');
      return;
    }
  }
  
  // 1. Send results for EXECUTED tests (passed/failed) using BULK API
  if (state.executedResults.size > 0) {
    console.log(`\n📤 Sending results for ${state.executedResults.size} executed tests (BULK)...`);
    
    const bulkResults: BulkResultItem[] = [];
    for (const [caseId, result] of state.executedResults) {
      bulkResults.push({
        case_id: caseId,
        status: result.status,
        time_ms: result.duration,
        stacktrace: result.error,
      });
    }
    
    const { sent, errors } = await sendBulkResults(runId, bulkResults);
    console.log(`   ✅ Done: ${sent} sent, ${errors} errors`);
  }
  
  const onlyInQase = [...state.qaseCaseIds].filter(id => !state.automationCases.has(id));
  
  // 2. Send "skipped" for QASE-only cases using BULK API
  if (onlyInQase.length > 0) {
    console.log(`\n⏭️  Sending "skipped" for ${onlyInQase.length} cases not in automation (BULK)...`);
    
    const skippedResults: BulkResultItem[] = onlyInQase.map(caseId => ({
      case_id: caseId,
      status: 'skipped' as const,
      comment: 'Not automated yet',
    }));
    
    const { sent, errors } = await sendBulkResults(runId, skippedResults);
    console.log(`   ✅ Done: ${sent} sent, ${errors} errors`);
  }
  
  const onlyInAutomation = [...state.automationCases.entries()].filter(
    ([id]) => !state.qaseCaseIds.has(id)
  );
  
  if (onlyInAutomation.length > 0) {
    console.log(`\n🆕 Creating ${onlyInAutomation.length} new cases in QASE Repository...`);
    
    const sectionId = await getOrCreateSection();
    if (!sectionId) {
      console.error('❌ Cannot create cases: no section ID');
    } else {
      for (const [oldId, title] of onlyInAutomation) {
        const newCaseId = await createCase(title, sectionId);
        
        if (newCaseId) {
          const result = state.executedResults.get(oldId);
          if (result) {
            await sendResult(runId, newCaseId, result.status, {
              time_ms: result.duration,
              stacktrace: result.error,
            });
          }
        }
      }
    }
    
    console.log(`   Done creating new cases`);
  }
  
  const executedWithoutId = state.executedResultsWithoutId;
  
  if (executedWithoutId.size > 0) {
    console.log(`\n📝 Creating ${executedWithoutId.size} new test cases and sending results...`);
    
    const sectionId = await getOrCreateSection();
    if (!sectionId) {
      console.error('❌ Cannot create cases: no section ID');
    } else {
      const newCaseResults: BulkResultItem[] = [];
      let created = 0;
      let failed = 0;
      
      for (const [title, result] of executedWithoutId) {
        const newCaseId = await createCase(title, sectionId);
        
        if (newCaseId) {
          created++;
          newCaseResults.push({
            case_id: newCaseId,
            status: result.status,
            time_ms: result.duration,
            stacktrace: result.error,
          });
        } else {
          failed++;
        }
        
        if ((created + failed) % 10 === 0) {
          console.log(`      Created: ${created}/${executedWithoutId.size}`);
        }
      }
      
      console.log(`   ✅ Created ${created} cases, ${failed} failed`);
      
      if (newCaseResults.length > 0) {
        console.log(`\n📤 Sending results for new cases (BULK)...`);
        const { sent, errors } = await sendBulkResults(runId, newCaseResults);
        console.log(`   ✅ Done: ${sent} sent, ${errors} errors`);
      }
    }
  }
  
  // Cleanup results file
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      fs.unlinkSync(RESULTS_FILE);
    }
  } catch (e) {
    // ignore
  }
  
  console.log('\n✅ QASE sync completed');
}

export function getState(): SyncState {
  return state;
}

export default {
  initSync,
  completeSync,
  recordTestResult,
  extractCaseId,
  extractAllCaseIds,
  getState,
  fetchPlanCases,
  fetchSuiteCases,
  parseAutomationCases,
};
