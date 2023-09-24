/* eslint-disable no-console */
import { Expo } from 'expo-server-sdk'

type Notification = {
  pushTokens: string[]
  body: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
  title: string
}

const sendNotification = async ({
  pushTokens,
  body,
  data,
  title
}: Notification) => {
  console.log('notification')
  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  const expo = new Expo({ accessToken: process.env.EXPO_PUSH_TOKEN })

  // Create the messages that you want to send to clients
  const messages = []
  for (const pushToken of pushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`)
      continue
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      body,
      data: data,
      sound: 'default',
      title,
      to: pushToken
    })
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages)
  const tickets = []
  ;(async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
        console.log(ticketChunk)
        tickets.push(...ticketChunk)
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error)
      }
    }
  })()
}

export default sendNotification
