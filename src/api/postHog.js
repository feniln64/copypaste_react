import { PostHog } from 'posthog-node'

const client = new PostHog(
    'phc_lZpmcwWp5TdXxmBAGiCfIyQLBVii6cnYN3msosyyyCC',
    { host: 'https://app.posthog.com' }
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
