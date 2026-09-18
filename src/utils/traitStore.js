import { TRAITS } from '../data/traits';

// Runtime trait catalog. App injects custom traits (from Firebase) via setTraits();
// when none are configured we fall back to the built-in TRAITS.
let _traits = null;
export function setTraits(t) { _traits = (Array.isArray(t) && t.length) ? t : null; }
export function getTraits() { return _traits || TRAITS; }
