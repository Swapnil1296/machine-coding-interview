import MultiStepUserRegistrationForm from './MultiStepRegistration/MultiStepUserRegistrationForm'

import "./App.css";

// 1. Functional requirements
// Implement these four steps:

// Step 1 – Personal information
// - First name
// - Last name
// - Email
// - Phone number
// - Date of birth
// Step 2 – Address details
// - Country
// - State
// - City
// - Postal code
// - Full address
// Step 3 – Account details
// - Username
// - Password
// - Confirm password
// - Accept terms and conditions
// Step 4 – Review and submit
// - Display all previously entered information.
// - Provide an Edit button for each section.
// - Allow users to return to the relevant step.
// - Submit registration.
// 2. Validation requirements
// Field	Validation
// First/last name	Required, minimum 2 characters
// Email	Valid email format
// Phone	Valid 10-digit Indian mobile number
// Date of birth	Required, must be 18+
// Postal code	Required, 6 digits
// Password	Minimum 8 characters, uppercase, lowercase, number
// Confirm password	Must match password
// Terms	Must be accepted

// Display field-level validation errors.
// 3. UI behavior
// - Show a progress indicator (Step 1 of 4).
// - Next button validates the current step before proceeding.
// - Previous button returns to the previous step without losing data.
// - Prevent moving forward if validation fails.
// - Show a summary on the final step.
// - Edit buttons should navigate to the relevant step.
// - Show a loading state during submission.
// - Show a success message after successful submission.
// 4. API requirements
// Use a simulated API for registration.

// Endpoint: POST https://dummyjson.com/users/add

// 5. Technical constraints
// - React functional components and hooks.
// - Use useState or useReducer.
// - Do not use Formik or React Hook Form.
// - Do not use a UI component library.
// - Keep validation logic separate from JSX.
// - Use reusable components where appropriate.
// - Use immutable state updates.
// - TypeScript is encouraged, but JavaScript is acceptable.
// 6. Edge cases you must handle
// 1. User clicks Next without filling required fields.
// 2. User enters an invalid email.
// 3. Password and confirm password don't match.
// 4. User navigates backward and changes previously entered details.
// 5. User refreshes the page midway through registration.
// 6. User double-clicks Submit.
// 7. API returns an error.
// 8. User tries to submit without accepting terms.
// 7. Acceptance criteria
// Your application should pass these tests:
// Test	Expected result
// Empty Step 1 → Next	Display validation errors
// Valid Step 1 → Next	Navigate to Step 2
// Step 2 → Previous	Previous data remains
// Invalid password → Next	Show password errors
// Mismatched passwords	Prevent progression
// Review → Edit Address	Navigate to Step 2
// Refresh midway	Restore saved progress
// Submit twice	Only one submission
// API failure	Show error and allow retry
// Successful submission	Show success state

function App() {
  return <><MultiStepUserRegistrationForm /></>;
}

export default App;
