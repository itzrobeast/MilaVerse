export function getPlatform() {
    if (/mobile/i.test(navigator.userAgent)) {
      return 'Mobile';
    } else if (/tablet/i.test(navigator.userAgent)) {
      return 'Tablet';
    }
    return 'Web';
  }
  