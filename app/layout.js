import './globals.css'
import Layout from '../Layout'

export const metadata = {
  title: 'SpecSense - Device Suggester AI',
  description: 'Find the perfect device tailored to your needs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
