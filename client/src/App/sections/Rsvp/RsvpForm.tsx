import React, { useRef, useState, MouseEventHandler } from 'react'
import * as B from 'react-bootstrap'
import { gql, useMutation } from 'urql'
import {
  Mutation,
  MutationCreateParticipantArgs,
  MutationUpdateParticipantArgs,
  Participant,
  ParticipantGuest,
} from 'brittanyandcaleb.gay.graphql-api/types'

import { useUser } from '@app/hooks/useUser'
import { logger } from '@app/log'
import './index.css'
import { shoot_confetti } from './confetti-cannon'

const log = logger('RsvpForm')

const CreateParticipant = gql`
  mutation CreateParticipant($input: CreateParticipantInput!) {
    createParticipant(input: $input) {
      participant {
        email
        given_name
        family_name
        attending
        guests {
          name
        }
      }
    }
  }
`

const UpdateParticipant = gql`
  mutation UpdateParticipant($input: UpdateParticipantInput!) {
    updateParticipant(input: $input) {
      participant {
        email
        given_name
        family_name
        attending
        guests {
          name
        }
      }
    }
  }
`

type Props = {
  initialValues: Participant | null
  goBack: () => unknown
  onSubmit: () => unknown
}

export function RsvpForm({ initialValues, goBack, onSubmit }: Props) {
  const { payload } = useUser().getSignInUserSession()!.getIdToken()
  const [create_mutation_result, create_participant] = useMutation<
    Pick<Mutation, 'createParticipant'>,
    MutationCreateParticipantArgs
  >(CreateParticipant)
  const [update_mutation_result, update_participant] = useMutation<
    Pick<Mutation, 'updateParticipant'>,
    MutationUpdateParticipantArgs
  >(UpdateParticipant)

  const is_executing_mutation = create_mutation_result.fetching || update_mutation_result.fetching
  const mutation_error = create_mutation_result.error || update_mutation_result.error

  const [given_name, set_given_name] = useState<string>(
    initialValues?.given_name || payload.given_name || ''
  )
  const [family_name, set_family_name] = useState<string>(
    initialValues?.family_name || payload.family_name || ''
  )

  const [attending, set_attending] = useState<boolean>(initialValues?.attending || false)

  // Editing guests is a little complicated...
  const [guests, set_guests] = useState<ParticipantGuest[]>(
    initialValues?.guests?.map(({ name }) => ({ name })) || []
  )
  const [editing_existing_guest, set_editing_existing_guest] = useState<{
    name: string
    index: number
  }>({ name: '', index: -1 })
  const [guest_name, set_guest_name] = useState<string>('')

  const input_ref = useRef<HTMLInputElement>(null)

  const add_guest = (name: string) => {
    name = name.trim()
    if (!name) {
      return
    }

    const next_guests = [...guests]
    if (editing_existing_guest.index > -1) {
      next_guests.splice(editing_existing_guest.index, 0, { name })
    } else {
      next_guests.push({ name })
    }
    set_guests(next_guests)

    set_guest_name('')
  }

  const [submitted, set_submitted] = useState(false)

  const submit: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault()

    shoot_confetti()
    if (submitted) {
      // they can always back out and come back in, but in the meantime, let
      // them shoot confetti to their heart's content
      return
    }

    const mutation = initialValues ? update_participant : create_participant
    const vars = {
      input: {
        email: payload.email,
        given_name: given_name.trim(),
        family_name: family_name.trim(),
        attending,
        guests,
      },
    }
    const resp = await mutation(vars)
    log.debug('mutation result', resp)
    if (!resp.error) {
      onSubmit()
      set_submitted(true)
    }
  }

  return (
    <B.Form>
      <div>
        <B.CloseButton className="float-end" onClick={goBack} />
        <B.Form.Group
          controlId="formAttendingYes"
          className="mb-3"
          style={{ marginBottom: '10px' }}
        >
          <B.Form.Check
            type="radio"
            label="Yes, I plan on coming!"
            checked={attending === true}
            onChange={() => set_attending(true)}
          />
        </B.Form.Group>
        <B.Form.Group controlId="formAttendingNo" className="mb-3">
          <B.Form.Check
            type="radio"
            label="No, I can't make it."
            checked={attending === false}
            onChange={() => set_attending(false)}
          />
        </B.Form.Group>
        <div className="rsvp_form_label">Aaand, what's your name?</div>
        <B.InputGroup className="mb-3">
          <B.FloatingLabel controlId="given_name" label="First">
            <B.Form.Control
              type="text"
              placeholder="First"
              value={given_name}
              required
              onChange={(event) => {
                set_given_name(event.target.value)
              }}
              aria-label="First name"
            />
          </B.FloatingLabel>
          <B.FloatingLabel controlId="family_name" label="Last">
            <B.Form.Control
              type="text"
              placeholder="Last"
              value={family_name}
              required
              onChange={(event) => {
                set_family_name(event.target.value)
              }}
              aria-label="Last name"
            />
          </B.FloatingLabel>
        </B.InputGroup>
        <div className="rsvp_form_label">
          Who do you plan on bringing?{' '}
          {guests.length ? <span style={{ fontSize: '0.7rem' }}>(Tap name to edit)</span> : null}
        </div>
        <B.Form.Group>
          <ul className="rsvp_form_guests">
            {guests.map((guest, index) => (
              <B.Collapse key={index} in appear>
                <li key={index}>
                  <span
                    onClick={() => {
                      set_guests(guests.filter((_g, i) => i !== index))
                      set_editing_existing_guest({ name: guest.name, index })
                      set_guest_name(guest.name)
                      input_ref.current?.focus()
                    }}
                  >
                    {guest.name}
                  </span>{' '}
                  <span
                    style={{ padding: '10px', cursor: 'pointer' }}
                    onClick={() => {
                      set_guests(guests.filter((_g, i) => i !== index))
                    }}
                  >
                    🅧
                  </span>
                </li>
              </B.Collapse>
            ))}
          </ul>
          <B.Row>
            <B.Col xs={10}>
              <B.FloatingLabel controlId="guest" label="Guest's full name" className="mb-3">
                <B.Form.Control
                  type="text"
                  placeholder="Guest's full name"
                  ref={input_ref}
                  value={guest_name}
                  onChange={(event) => {
                    set_guest_name(event.target.value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      add_guest(guest_name)
                    }
                  }}
                  onBlur={() => {
                    if (guest_name && editing_existing_guest.name === guest_name) {
                      const next_guests = [...guests]
                      next_guests.splice(editing_existing_guest.index, 0, { name: guest_name })
                      set_guests(next_guests)

                      set_editing_existing_guest({ name: '', index: -1 })
                      set_guest_name('')
                    }
                  }}
                />
              </B.FloatingLabel>
            </B.Col>
            <B.Col xs={2}>
              <B.Button
                size="lg"
                type="button"
                variant="success"
                onClick={() => add_guest(guest_name)}
                style={{
                  marginLeft: '-10px',
                  position: 'relative',
                  bottom: '-4px',
                }}
              >
                ✔
              </B.Button>
            </B.Col>
          </B.Row>
        </B.Form.Group>
      </div>
      <div className="d-grid gap-2">
        <B.Button
          variant="primary"
          type="submit"
          size="lg"
          onClick={submit}
          disabled={is_executing_mutation}
        >
          Submit! 🕊
        </B.Button>
      </div>
      {mutation_error && (
        <B.Alert variant="danger" style={{ marginTop: '10px' }} dismissible>
          <B.Alert.Heading>Oops! There was an error submitting.</B.Alert.Heading>
          <p>Here's what we got back from the server:</p>
          <pre>{JSON.stringify(mutation_error, null, 2)}</pre>
          <p>Take a screenshot of this and text it to Caleb.</p>
        </B.Alert>
      )}
    </B.Form>
  )
}
