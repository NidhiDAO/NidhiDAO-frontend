import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as NidhiHomeIcon } from "../../assets/icons/hidhiHome.svg";
import { SvgIcon } from "@material-ui/core";

const externalUrls = [
  {
    title: "Docs",
    url: "https://docs.nidhidao.finance/",
    icon: <SvgIcon component={DocsIcon} />,
  },
  {
    title: "Nidhi home",
    url: "https://nidhidao.finance",
    icon: <SvgIcon color="primary" component={NidhiHomeIcon} />,
  },
];

export default externalUrls;
