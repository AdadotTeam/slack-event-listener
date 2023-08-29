import events from "./events";
import commands from "./commands";
import { App } from "@slack/bolt";

export default function (app: App): void {
  events(app);
  commands(app);
}
