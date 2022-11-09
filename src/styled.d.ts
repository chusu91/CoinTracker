import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
    cardBgColor: string;
    buttonBgColor: string;
    buttonColor: string;
  }
}

//declaration file! add my own Theme's property's type
