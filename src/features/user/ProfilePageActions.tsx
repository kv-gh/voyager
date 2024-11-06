import { IonButton, useIonActionSheet } from "@ionic/react";
import { footstepsOutline } from "ionicons/icons";
import * as _ from "radashi";

import { usernameSelector } from "#/features/auth/authSelectors";
import HeaderEllipsisIcon from "#/features/shared/HeaderEllipsisIcon";
import { useBuildGeneralBrowseLink } from "#/helpers/routes";
import { useOptimizedIonRouter } from "#/helpers/useOptimizedIonRouter";
import { useAppSelector } from "#/store";

export default function ProfilePageActions() {
  const router = useOptimizedIonRouter();
  const username = useAppSelector(usernameSelector);
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const [presentActionSheet] = useIonActionSheet();

  function present() {
    presentActionSheet({
      cssClass: "left-align-buttons",
      buttons: _.sift([
        username && {
          text: "Mod Log",
          data: "modlog",
          icon: footstepsOutline,
          handler: () => {
            router.push(buildGeneralBrowseLink(`/u/${username}/log`));
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ]),
    });
  }

  return (
    <IonButton onClick={present}>
      <HeaderEllipsisIcon slot="icon-only" />
    </IonButton>
  );
}
