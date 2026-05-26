export let notifPerm = false;

export async function reqNotif() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') notifPerm = true;
  else if (Notification.permission === 'default') {
    const r = await Notification.requestPermission();
    notifPerm = (r === 'granted');
  }
}

export function sendNotif(title, body) {
  if (!notifPerm) return;
  try {
    const n = new Notification(title, { body, icon: '/icons/icon-192.png', tag: 'bbt-rest' });
    setTimeout(() => n.close(), 5000);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  } catch (e) { console.warn('Notification failed:', e) }
}
