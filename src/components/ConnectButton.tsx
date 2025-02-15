'use client'

export default function ConnectButton() {
  return (
    // @ts-expect-error Reown AppKit web component
    <appkit-button />
  )
}
