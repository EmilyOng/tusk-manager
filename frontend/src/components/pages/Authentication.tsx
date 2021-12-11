import { useState } from 'react'
import FormSignUp, { SignUpForm } from 'components/organisms/FormSignUp'
import { RequestAPI } from 'api/request'
import Message from 'components/atoms/Message'

function Authentication() {
  const Request = new RequestAPI()
  const [error, setError] = useState('')

  function onSignUp(form: SignUpForm) {
    Request.post('http://localhost:5000/api/public/signup', {
      Name: form.name,
      Email: form.email,
      Password: form.password,
    }).then((res) => {
      if (res.error) {
        setError(res.error)
      }
    })
  }

  return (
    <div>
      <FormSignUp onSignUp={onSignUp}>
        <Message type="danger" text={error} />
      </FormSignUp>
    </div>
  )
}

export default Authentication
