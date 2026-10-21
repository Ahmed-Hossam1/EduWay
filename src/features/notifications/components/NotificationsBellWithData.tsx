import { getMyNotifications } from "../server/getMyNotifications";
import { NotificationsBell } from "./NotificationsBell";

export default async function NotificationsBellWithData() {
    const notifications = await getMyNotifications();

    return (
        <NotificationsBell notifications={notifications} />
    );
}