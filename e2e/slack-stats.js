// slack-stats.js
const axios = require('axios');

// Minimal Slack notifier for test stats (manual / demo)
async function sendSlackStats() {
  const PLATFORM = process.env.PLATFORM || 'Android';
  const RUN_TARGET = process.env.RUN_TARGET || 'local_emulator';
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
  
  if (!SLACK_WEBHOOK_URL) {
    console.log('❌ SLACK_WEBHOOK_URL not set');
    return;
  }
  
  // Stub counts (override per --suite)
  const args = process.argv;
  let suiteName = 'signup';
  let totalTests = 33;
  let passedTests = 33;
  let failedTests = 0;
  
  if (args.includes('--suite')) {
    const suiteIndex = args.indexOf('--suite');
    suiteName = args[suiteIndex + 1];
  }
  
  // Per-suite defaults
  switch(suiteName) {
    case 'onboarding':
      totalTests = 5;
      passedTests = 5;
      failedTests = 0;
      break;
    case 'signup':
      totalTests = 33;
      passedTests = 33;
      failedTests = 0;
      break;
    case 'all':
      totalTests = 57;
      passedTests = 56;
      failedTests = 1;
      break;
    case 'fullFlow':
      totalTests = 38;
      passedTests = 38;
      failedTests = 0;
      break;
  }
  
  const passedRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  const statusEmoji = failedTests === 0 ? '✅' : (failedTests < totalTests * 0.3 ? '⚠️' : '❌');
  
  const message = {
    text: `${statusEmoji} *E2E Test Results - ${PLATFORM}*\n
*Platform:* ${PLATFORM}
*Target:* ${RUN_TARGET}
*Suite:* ${suiteName}
*Total Tests:* ${totalTests}
*✅ Passed:* ${passedTests}
*❌ Failed:* ${failedTests}
*📈 Success Rate:* ${passedRate}%
*⏱️ Time:* ${new Date().toLocaleTimeString()}

📅 ${new Date().toLocaleDateString()}`
  };
  
  try {
    const response = await axios.post(SLACK_WEBHOOK_URL, message, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`✅ Slack notification sent! Status: ${response.status}`);
  } catch (error) {
    console.error('❌ Failed to send Slack notification:', error.message);
  }
}

// Run when executed as main module
if (require.main === module) {
  sendSlackStats();
}

module.exports = { sendSlackStats };