# Slack Integration Setup - CTRF Format

## Overview

The E2E test framework uses **CTRF (Common Test Report Format)** to generate standardized test reports and automatically send them to Slack channels after test execution completes. This provides real-time visibility into test runs for your team.

**Architecture:**
- **wdio-ctrf-json-reporter** generates CTRF JSON reports
- **slack-ctrf** sends CTRF reports to Slack
- Standardized format works across different testing tools

## Prerequisites

1. **Slack Workspace** with admin access
2. **Incoming Webhook** URL from Slack

## Step 1: Install Dependencies

The required packages are already in `package.json`, but if you need to install:

```bash
npm install --save-dev wdio-ctrf-json-reporter slack-ctrf
```

## Step 2: Create Slack Incoming Webhook

1. Go to your Slack workspace
2. Navigate to **Apps** → Search for **"Incoming Webhooks"**
3. Click **"Add to Slack"**
4. Choose the channel where you want to receive test notifications
5. Click **"Add Incoming Webhooks integration"**
6. Copy the **Webhook URL**

## Step 3: Configure Environment Variables

Add the following to your `.env` file:

```env
################################
# SLACK NOTIFICATIONS
################################
ENABLE_SLACK=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Parameters:

- **`ENABLE_SLACK`**: Enable/disable Slack notifications (`true`/`false`)
- **`SLACK_WEBHOOK_URL`**: Full webhook URL from Slack (required if `ENABLE_SLACK=true`)

## Step 4: Run Tests

Run your tests as usual:

```bash
# With Slack notifications
npm run test:all

# Or with specific suite
npm run test:signup
```

After tests complete, results will be automatically sent to your Slack channel.

## How It Works

1. **Test Execution**: Tests run normally with WebdriverIO
2. **CTRF Report Generation**: `wdio-ctrf-json-reporter` automatically generates a CTRF JSON report in the `ctrf/` directory
3. **Slack Notification**: After tests complete, `slack-ctrf` reads the CTRF report and sends formatted results to Slack

## Message Format

The Slack message (generated from CTRF format) includes:

- **Status**: ✅ Success or ❌ Failure
- **Platform**: Android or iOS
- **Target**: Execution target (emulator, real device, BrowserStack)
- **Suite**: Test suite name
- **Duration**: Total execution time
- **Test Statistics**:
  - Total tests
  - Pass rate percentage
  - Passed count
  - Failed count
  - Skipped count (if any)
- **Failed Tests List**: Details of failed tests (up to 10, with error messages)

### Example Message:

The `slack-ctrf` package automatically formats CTRF reports into rich Slack messages with:

- **Status Summary**: ✅ Success or ❌ Failure
- **Test Statistics**: Total, passed, failed, skipped counts
- **Duration**: Total execution time
- **Failed Tests**: List of failed tests with error messages
- **Platform Information**: Android/iOS, target, suite name
- **Visual Progress Bars**: Color-coded test result breakdown

Example output:
```
✅ Test Results Summary

Total: 55 | Passed: 52 | Failed: 3 | Skipped: 0
Duration: 10m 14s
Platform: Android (local_emulator)

Failed Tests:
1. [PAS-XXX] User Enter master password and see Select a Vault screen
   Error: Enter password screen not visible
2. [PAS-XXX] Check that Folder name changes after renaming on HomePage
   Error: Test Folder1 name should be visible
3. [PAS-XXX] User is logged out after tapping on System Home button
   Error: Enter password screen not visible
```

## Configuration Options

### Enable/Disable Slack Notifications

```env
# Enable
ENABLE_SLACK=true

# Disable (default)
ENABLE_SLACK=false
```

### Conditional Notifications

You can enable Slack only for specific test runs:

```bash
# Enable Slack for BrowserStack runs
cross-env ENABLE_SLACK=true npm run e2e:android:bs

# Disable Slack for local runs
cross-env ENABLE_SLACK=false npm run test:all
```

## Troubleshooting

### Notifications Not Sending

1. **Check `ENABLE_SLACK`**:
   ```bash
   # Verify it's set to true
   echo $ENABLE_SLACK  # Should output: true
   ```

2. **Verify Webhook URL**:
   - Ensure `SLACK_WEBHOOK_URL` is set correctly
   - URL should start with `https://hooks.slack.com/services/`
   - Check for typos or extra spaces

3. **Check Console Logs**:
   - Look for `📤 Test results sent to Slack successfully` message
   - Or error messages like `❌ Failed to send test results to Slack`

4. **Test Webhook Manually**:
   ```bash
   curl -X POST -H 'Content-type: application/json' \
   --data '{"text":"Test message"}' \
   YOUR_SLACK_WEBHOOK_URL
   ```

### Webhook URL Security

⚠️ **Important**: Never commit your webhook URL to version control!

- Keep it in `.env` file (which should be in `.gitignore`)
- Use environment variables in CI/CD pipelines
- Rotate webhook URLs if they're accidentally exposed

## CTRF Report Location

CTRF JSON reports are automatically generated in the `ctrf/` directory after each test run. The reports follow the Common Test Report Format standard and can be used with various tools.

### Report Structure

- **Location**: `e2e-mobile-tests/ctrf/`
- **Format**: JSON files following CTRF schema
- **Naming**: Auto-generated with timestamps
- **Content**: Complete test execution data including results, duration, and metadata

## Advanced Configuration

### CTRF Reporter Options

You can customize CTRF report generation in `wdio.conf.ts`:

```typescript
['ctrf-json', {
  outputDir: './ctrf',           // Custom output directory
  appName: 'PearPass Mobile',    // Application name
  appVersion: '1.1.1',           // App version
  osPlatform: 'Android',         // Platform
  testType: 'e2e',               // Test type
  minimal: false                 // Full vs minimal report
}]
```

### Custom Slack Message Formatting

The `slack-ctrf` package provides options for customizing Slack messages:

```bash
# Send only on failure
npx slack-ctrf --webhook-url URL --onFailOnly report.json

# Custom channel/user mentions
npx slack-ctrf --webhook-url URL --channel "#qa-team" report.json
```

### Multiple Channels

To send to multiple channels, create multiple webhooks and call the reporter multiple times in `onComplete` hook.

## Integration with CI/CD

In CI/CD pipelines, set environment variables:

```yaml
# GitHub Actions example
env:
  ENABLE_SLACK: true
  SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

```bash
# GitLab CI example
variables:
  ENABLE_SLACK: "true"
  SLACK_WEBHOOK_URL: "$SLACK_WEBHOOK_URL"
```

## Example Workflow

1. Developer runs tests locally
2. Tests complete
3. Results automatically sent to Slack
4. Team sees test status immediately
5. Failed tests are highlighted with error details

---

**Last Updated**: January 2026
