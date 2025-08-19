# Product Requirements Document: Shadow Enhancements

## Project Overview
Shadow is a background coding agent with a real-time web interface that enables autonomous agents to work on GitHub repositories through real-time collaboration, semantic code search, and long-horizon task management. The platform provides both local and remote execution modes with enterprise-grade security.

## Current State
Shadow currently supports multiple LLM providers:
- OpenAI (GPT-5, GPT-4.1, GPT-4o, etc.)
- Anthropic (Claude Opus 4, Claude Sonnet 4, Claude 3.5 Haiku)
- OpenRouter (Various models including Grok 3, Kimi K2, Qwen3 Coder)
- Google (Gemini models - backend integration exists but not fully exposed in UI)

Users can configure API keys for OpenAI, Anthropic, and OpenRouter in the settings interface, but Google/Gemini integration is not yet fully exposed in the UI despite being implemented in the backend.

## Requested Enhancements

### 1. Gemini AI Integration in Settings
**Objective:** Expose Gemini AI integration in the settings UI to allow users to input their Gemini API key.

**Current Status:**
- Backend integration for Gemini AI already exists in the codebase
- API key type definitions include Google/Gemini
- Model provider implementation supports Gemini
- Available models include Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash, and Gemini 1.5 Flash 8B
- UI components for API key management do not currently expose Gemini

**Requirements:**
- Add Gemini API key input field to the settings UI following the same pattern as existing providers
- Implement validation for Gemini API keys
- Update the model selection UI to display Gemini models when a valid API key is provided
- Ensure proper error handling for invalid or missing Gemini API keys

### 2. Verify OpenRouter Models Functionality
**Objective:** Confirm that specific OpenRouter models (Qwen3 Coder Free and Kimi K2 by Moonshot Free) are properly integrated and functional.

**Current Status:**
- OpenRouter integration exists in the codebase
- Model definitions for Qwen3 Coder Free (`qwen/qwen3-coder:free`) and Kimi K2 by Moonshot Free (`moonshotai/kimi-k2:free`) are already defined in the models.ts file
- It's unclear if these models are properly accessible and functional in the UI

**Requirements:**
- Verify that these models appear in the model selection UI when an OpenRouter API key is provided
- Ensure that these models can be successfully used for tasks
- Fix any issues preventing these models from being properly utilized
- Add appropriate error handling for model-specific errors

### 3. Fix Prisma Client and TSX Command Error
**Objective:** Resolve the error where the 'tsx' command is not recognized, which is preventing proper execution of the application.

**Current Status:**
- Error message indicates that 'tsx' is not recognized as an internal or external command
- This is likely a development environment setup issue
- The error occurs when trying to start the server with nodemon

**Requirements:**
- Identify the root cause of the 'tsx' command not being recognized
- Install missing dependencies or update package.json scripts as needed
- Ensure consistent development environment setup across the team
- Document the solution for future reference

## Implementation Details

### 1. Gemini AI Integration in Settings

#### UI Changes
- Update `apps/frontend/components/auth/settings-modal/model-settings.tsx` to include Gemini API key input field
- Add state management for Gemini API key input: `googleInput`, `savingGoogle`, etc.
- Add Gemini to the providers array to render in the UI
- Implement API key visibility toggle for Gemini
- Add validation icon rendering for Gemini

#### Backend Changes
- Ensure `apps/server/src/agent/llm/models/model-provider.ts` properly handles Gemini API keys
- Update validation logic in `apps/frontend/lib/api-key-validator.ts` to validate Gemini API keys
- Ensure proper error handling for Gemini-specific errors

### 2. OpenRouter Models Verification

#### Testing Tasks
- Verify that Qwen3 Coder Free and Kimi K2 by Moonshot Free appear in the model selection UI
- Test these models with actual tasks to ensure they function correctly
- Document any issues found and implement fixes

#### Potential Fixes
- Update model definitions if needed
- Ensure proper error handling for these specific models
- Fix any UI issues preventing these models from being displayed or selected

### 3. TSX Command Error Fix

#### Investigation Steps
- Check if 'tsx' package is properly installed in the project
- Verify that the package.json scripts are correctly defined
- Check for any environment-specific issues

#### Potential Solutions
- Install missing dependencies: `npm install -D tsx`
- Update package.json scripts to use the correct path to tsx
- Ensure proper PATH configuration in the development environment
- Consider using alternative approaches if tsx continues to cause issues

## Success Criteria

### 1. Gemini AI Integration
- Users can successfully input and save their Gemini API key in the settings UI
- Gemini API keys are properly validated
- Gemini models appear in the model selection UI when a valid API key is provided
- Users can successfully use Gemini models for tasks

### 2. OpenRouter Models
- Qwen3 Coder Free and Kimi K2 by Moonshot Free appear in the model selection UI
- Users can successfully use these models for tasks
- Any errors or issues with these models are properly handled and communicated to the user

### 3. TSX Command Error
- The 'tsx' command is properly recognized in the development environment
- The application starts successfully without the error
- The solution is documented for future reference

## Timeline
1. Investigation and Assessment: 1-2 days
2. Implementation: 2-3 days
3. Testing and Validation: 1-2 days
4. Documentation and Deployment: 1 day

Total estimated time: 5-8 days

## Risks and Mitigations

### Risks
1. **API Key Security**: Adding another provider increases the surface area for potential security issues
2. **Model Compatibility**: Different models may have different capabilities and limitations
3. **Development Environment Consistency**: Fixing the tsx issue may introduce other environment-specific problems

### Mitigations
1. **Security Review**: Ensure that API key handling follows the same secure patterns as existing providers
2. **Comprehensive Testing**: Test all models with a variety of tasks to ensure compatibility
3. **Documentation**: Document the development environment setup to ensure consistency across the team

## Future Considerations
1. **Unified Provider Interface**: Consider implementing a more unified interface for managing multiple LLM providers
2. **Model Performance Metrics**: Add functionality to track and compare performance across different models
3. **Cost Management**: Implement features to help users manage costs across multiple providers
4. **Automated Environment Setup**: Create scripts to automate development environment setup to prevent issues like the tsx error

