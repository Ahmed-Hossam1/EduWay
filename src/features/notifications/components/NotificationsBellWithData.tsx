import { getMyNotifications } from "../server/getMyNotifications";
import { NotificationsBell } from "./NotificationsBell";

// Server component: loads the notifications, then shows the bell (streamed by the @notifications slot)
export async function NotificationsBellWithData() {
    const notifications = await getMyNotifications();

    return (
        <NotificationsBell notifications={notifications} />
    );
}