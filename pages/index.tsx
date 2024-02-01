import { Layout, Page, Text, Link } from '@vercel/examples-ui'
import Headers from '@components/headers'
export default function Index() {

  const style = {
    backgroundColor: '#f4f4f4',
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '5px',
    overflow: 'auto',
    fontFamily: 'monospace',
    color: '#333',
  };

  return (
    <Page>
      <Text variant="h2" className="mb-6">
        API Courses
      </Text>
      <Text className="mb-4">
       /api/courses/enroll
      </Text>
      <Text className="mb-4">
        For the demo below, you can send a maximum of{' '}
        <b>5 requests every 1 seconds</b>.
        This endpoint can process only one enrollment per request.
      </Text>
      <Text className="mb-4">
        Request payload example:
      </Text>
      <pre className="mb-4" style={style}>
        <code>
        {`
        {
          "curso": "string",
          "email": "string"
        }`
        }
        </code>
      </pre>
      <Text className="mb-4">
        Response payload example:
      </Text>
      <pre className="mb-4" style={style}>
        <code>
        {`
        {
          message: "string",
          data: {  
            "curso": "string",
            "email": "string",
            "curso_enroll_id": "uuid"
          }
        }`
        }
        </code>
      </pre>
      <Headers path="/api/courses/enroll">Make a request</Headers>
      <Text className="mb-4">
       /api/courses/batch
      </Text>
      <Text className="mb-4">
        For the demo below, you can send a maximum of{' '}
        <b>5 requests every 10 seconds</b>.
        This endpoint can process multiple enrollments at once, maximum of 100 per request.
      </Text>
      <Text className="mb-4">
        Request payload example:
      </Text>
      <pre className="mb-4" style={style}>
        <code>
        {`
        [
          {
            "curso": "string",
            "email": "string"
          }
        ]`
        }
        </code>
      </pre>
      <Text className="mb-4">
        Response payload example:
      </Text>
      <pre className="mb-4" style={style}>
        <code>
        {`
        {
          message: "string",
          data: [{  
            "curso": "string",
            "email": "string",
            "curso_enroll_id": "uuid"
          }]
        }`
        }
        </code>
      </pre>
      <Headers path="/api/courses/enroll/batch">Make a request</Headers>
    </Page>
  )
}

Index.Layout = Layout
