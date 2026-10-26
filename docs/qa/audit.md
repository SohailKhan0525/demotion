# MotionKit audit of src  (68 files)

## [HIGH] linear-interpolate: 42 hits
interpolate() without an easing option = linear motion (the #1 cause of amateur output)
- src/components/CardFan.tsx:61
- src/components/CardFan.tsx:62
- src/components/CardFan.tsx:64
- src/components/CardFan.tsx:66
- src/components/CardFan.tsx:67
- src/components/CardFan.tsx:69
- ... and 36 more

## [MED] pure-bw: 22 hits
pure black / white (#000, #fff, black, white): use tinted neutrals
- src/components/CardFan.tsx:118  "white"
- src/components/CardFan.tsx:125  "white"
- src/components/CodeTabs.tsx:68  "white"
- src/components/CursorActor.tsx:89  "white"
- src/components/DashboardChrome.tsx:19  #ffffff
- src/components/DashboardChrome.tsx:134  #ffffff
- ... and 16 more

## [MED] default-fonts: 5 hits
default or generic fonts (Arial, Helvetica, Roboto, Inter, system-ui, sans-serif)
- src/components/Safari.tsx:129  Arial
- src/components/Safari.tsx:129  sans-serif
- src/font.ts:30  system-ui
- src/font.ts:30  sans-serif
- src/font.ts:32  sans-serif

## [MED] same-fade: 5 hits
many fades share the identical frame range: everything animates at once, no stagger
- src/components/CodeTabs.tsx:21  range 0-1 (x5)
- src/components/CodeTabs.tsx:94  range 0-1 (x5)
- src/components/DashboardChrome.tsx:65  range 0-1 (x5)
- src/components/FloatingCard.tsx:26  range 0-1 (x5)
- src/components/MaskReveal.tsx:26  range 0-1 (x5)

## [LOW] frame-magic: 1 hit
lots of numeric frame literals in interpolate ranges: breaks when bpm/fps change; prefer seconds/beats
- src  42 numeric-literal ranges

Summary: 5 rules triggered (1 high severity).
