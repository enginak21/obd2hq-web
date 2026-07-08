import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OBD2HQ',
    short_name: 'OBD2HQ',
    description: 'Ultimate Vehicle Diagnostic Code & Warning Light Database',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1c',
    theme_color: '#0a0f1c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
