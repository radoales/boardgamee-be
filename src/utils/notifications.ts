/* eslint-disable no-console */
import { Expo } from 'expo-server-sdk'

type Notification = {
  pushTokens: string[]
  body: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>
  title: string
}

const sendNotification = async ({
  pushTokens,
  body,
  data,
  title
}: Notification) => {
  console.log('notification')
  const expo = new Expo({ accessToken: process.env.EXPO_PUSH_TOKEN })

  const messages = []
  for (const pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`)
      continue
    }

    messages.push({
      body,
      data: data,
      sound: 'default',
      title,
      to: pushToken
    })
  }

  const chunks = expo.chunkPushNotifications(messages)
  const tickets = []
  ;(async () => {
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
        tickets.push(...ticketChunk)
      } catch (error) {
        console.error(error)
      }
    }
  })()
}

export default sendNotification
