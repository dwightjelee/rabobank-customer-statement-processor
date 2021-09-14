import {createServiceFactory, SpectatorService} from "@ngneat/spectator";
import {XmlParserService} from "./xml-parser.service";

const mockXmlData: string = `
<records>
  <record reference="1">
    <accountNumber>NL01RABO1234567891</accountNumber>
    <description>Description 1</description>
    <startBalance>10</startBalance>
    <mutation>-1</mutation>
    <endBalance>9</endBalance>
  </record>
  <record reference="2">
    <accountNumber>NL01RABO1234567892</accountNumber>
    <description>Description 2</description>
    <startBalance>20</startBalance>
    <mutation>-+2</mutation>
    <endBalance>22</endBalance>
  </record>
  <record reference="3">
    <accountNumber>NL01RABO1234567893</accountNumber>
    <description>Description 3</description>
    <startBalance>30</startBalance>
    <mutation>-3</mutation>
    <endBalance>27</endBalance>
  </record>
  </records>
`;

describe('XmlParserService', () => {
    let spectator: SpectatorService<XmlParserService>;
    const createService = createServiceFactory(XmlParserService)
});
