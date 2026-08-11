# BB Collection Android APK

This folder documents the free Android Trusted Web Activity route for the BB Collection website.

Website: https://cobra546.github.io/BBCollection/

The APK can be generated with Bubblewrap on a computer or GitHub Actions. No paid Play Store account is required for building or sideloading the APK. A Play Store developer account is only needed if publishing to Google Play.

## Build locally

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://cobra546.github.io/BBCollection/manifest.json
bubblewrap build
```

The generated APK can then be installed directly on Android.

## Important

The current push-notification issue is a Supabase backend issue and is independent of the APK packaging. The TWA will use the same website/backend until push delivery is fixed.
