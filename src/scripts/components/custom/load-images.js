import lozad from "lozad";

export const initImages = () => typeof lozad == 'function' && lozad('.lozad').observe();