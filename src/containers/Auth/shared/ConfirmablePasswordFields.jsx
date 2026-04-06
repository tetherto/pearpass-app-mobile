import { Form, PasswordField } from '@tetherto/pearpass-lib-ui-kit'

export const ConfirmablePasswordFields = ({
  passwordField,
  confirmPasswordField,
  testID
}) => (
  <Form testID={testID}>
    <PasswordField {...passwordField} />
    <PasswordField {...confirmPasswordField} />
  </Form>
)
