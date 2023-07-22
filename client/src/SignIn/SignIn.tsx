import React from 'react'
import * as B from 'react-bootstrap'

import { config } from '../config'

export function SignIn() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div
        className="position-absolute top-50 start-50 translate-middle"
        style={{ width: '95vw', maxWidth: '500px', margin: '-30px' /* for h1 */ }}
      >
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Thank you for RSVP'ing 🎉!</h1>
        <B.Carousel indicators={false} slide={false}>
          {[
            ['/assets/beauty_spot_0.jpg', "Here's a picture of us in Erwin, TN"],
            ['/assets/va_0.jpg', 'This is us at the VA in Johnson City'],
            ['/assets/beauty_spot_1.jpg', 'Another pic from Erwin'],
          ].map(([src, alt]) => (
            <B.Carousel.Item key={src}>
              <img className="d-block w-100" src={src} alt={alt} />
            </B.Carousel.Item>
          ))}
        </B.Carousel>
      </div>
      <div
        className="fixed-bottom"
        style={{ marginTop: '20px', maxWidth: '600px', margin: '0 auto' }}
      >
        <h4 style={{ textAlign: 'center' }}>Before you can proceed, please:</h4>
        <div className="d-grid gap-2" style={{ marginTop: '20px', marginBottom: '30px' }}>
          <a className="btn btn-primary btn-lg" href={config.sign_in_url}>
            Sign In 💘!
          </a>
        </div>
      </div>
    </div>
  )
}
