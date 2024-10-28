import React from 'react'

const PrivacyPolicy: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>One Cat a Day Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong> {currentDate}
      </p>

      <p>
        <strong>One Cat a Day</strong> is an app developed by <strong>0x10</strong> designed to
        provide daily cat images for entertainment. We value and respect our users' privacy. Below
        is our privacy policy:
      </p>

      <h2>Data Collection</h2>
      <p>
        <strong>One Cat a Day</strong> does not collect, store, or process any personal data from
        users. The app does not request or access any personal information, such as name, email,
        location, or any other identifying data.
      </p>

      <h2>Advertising and Third-Party Services</h2>
      <p>
        We do not include ads or use third-party services that collect user data.{' '}
        <strong>One Cat a Day</strong> is ad-free, and we do not monetize the app through data
        collection or sales.
      </p>

      <h2>Use of Information</h2>
      <p>
        Since <strong>One Cat a Day</strong> does not collect any data, we do not use, share, or
        sell any personal information from our users.
      </p>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We reserve the right to update this Privacy Policy in the future if the app’s features
        change. Users will be notified of any relevant changes through the app.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy, feel free to contact us
        through our website:{' '}
        <a href="http://ikerocio.com" target="_blank" rel="noopener noreferrer">
          ikerocio.com
        </a>
        .
      </p>
    </div>
  )
}

export default PrivacyPolicy
