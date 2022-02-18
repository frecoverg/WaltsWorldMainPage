import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import {  SvgIcon } from "@material-ui/core";
import styled from "styled-components";

const externalUrls = [
  {
    title: "Governance",
    url: "https://waltsworlddao.gitbook.io/waltsworld/community/governance",
    icon: <SvgIcon color="primary" component={GovIcon} />,
  },
  {
    title: "Docs",
    url: "https://waltsworlddao.gitbook.io/waltsworld/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
  {
    title: "Feedback",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfXuXbs7Kik-9lw55XRQAe10iSShxFvnF03_oO8t-Oc_Ic6-g/viewform",
    icon: <SvgIcon color="primary" component={FeedbackIcon} />,
  }
];

export default externalUrls;

const IconImg1 = styled.img`g

`
const IconImg2 = styled.img`

`
const IconImg3 = styled.img`

`
