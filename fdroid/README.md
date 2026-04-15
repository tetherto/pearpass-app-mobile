# F-Droid integration

This repo supports an F-Droid distribution channel selected via `PEARPASS_DISTRIBUTION=fdroid`.

Some F-Droid recipes require patches during the `prebuild` and/or `build` phases. Instead of embedding large patch blobs in the F-Droid metadata, store them in this repo and apply them with:

```bash
node scripts/fdroid/apply-patches.mjs prebuild
node scripts/fdroid/apply-patches.mjs build
```

Patch locations:

- `fdroid/patches/prebuild/*.patch`
- `fdroid/patches/build/*.patch`
