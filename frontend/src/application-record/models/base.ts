import { SpraypaintBase, Model } from "spraypaint"

@Model()
export class ApplicationRecord extends SpraypaintBase {
    static baseUrl = "http://localhost:4567"
    static apiNamespace = "/api/v1"
}
