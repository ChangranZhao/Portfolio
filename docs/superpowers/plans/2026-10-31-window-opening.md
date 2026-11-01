# Window opening timing

The user reports that opening still feels different from ThanasOS. Its current public Window.tsx uses animate-fade-in; tailwind.config.ts defines opacity 0→1 and scale .95→1 over 300ms ease-out. Those parameters already match Creative OS. Keep them; avoid inventing a different overshoot or slide.

The local native window starts its timeline inside createWindow, before callers finish titlebar relocation and content setup. React starts inside its layout-effect callback, also before the current commit and browser layout finish. Stage the animation paused at time zero, allow an initial rendering opportunity, then play the full timeline. Cancellation must remove scheduled frames so a close/drag/minimize cannot resurrect an opening animation. Remove the browser focus outline on the window container; keyboard controls retain their own focus indicators.

Regression test reproduced the missing staging on the previous implementation, then passed after the change. Seventeen focused motion/reveal/menu tests passed. No claim of exact live visual parity: the reference site timed out in browser inspection on this run; current upstream source was inspected directly.
