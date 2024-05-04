import { PostHog } from 'posthog-node'

const client = new PostHog(
    process.env.REACT_APP_POSTHOG_API_TOKEN,
    { host: process.env.REACT_APP_POSTHOG_URL }
)

const newEvent= (event, distinctId,url) => {
    client.capture({
        distinctId: distinctId,
        event: event,
        properties: {
            $current_url: url,
        },

    })
    client.flush()
}

export default newEvent
