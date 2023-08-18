import events from "./events";
import commands from "./commands";
import shortcuts from "./shortcuts";
import { App } from "@slack/bolt";

export default function (app: App): void {
  events(app);
  commands(app);
  shortcuts(app);
}
