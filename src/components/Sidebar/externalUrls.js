import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as NidhiHomeIcon } from "../../assets/icons/hidhiHome.svg";
import { SvgIcon } from "@material-ui/core";

const externalUrls = [
  {
    title: "Docs",
    url: "",
    icon: <SvgIcon component={DocsIcon} />,
  },
  {
    title: "Nidhi home",
    url: "",
    icon: <SvgIcon color="primary" component={NidhiHomeIcon} />,
  },
];

export default externalUrls;
