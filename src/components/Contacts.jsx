import React, { useState, useEffect, useRef } from "react";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Input,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  IconButton,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import Drawer from "./Drawer";
import { getCompanyDetails } from "../apis/apis";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [openRight, setOpenRight] = useState(false);

  const data = [
    {
      label: "About",
      value: "about",
      desc: <></>,
    },
    {
      label: "Activity",
      value: "activity",
      desc: <></>,
    },
    {
      label: "Contacts",
      value: "contacts",
      desc: <></>,
    },
  ];

  return (
    <>
      <div className="flex gap-3 h-full">
        <Card className="min-w-[328px] h-full">
          <div className="h-full flex flex-col justify-between">
            <div className="">
              <div className="p-2">
                <Input
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  label="Search"
                />
              </div>
              <List className="overflow-y-scroll">
                <ListItem>
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="candice"
                      src="https://docs.material-tailwind.com/img/face-1.jpg"
                    />
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Tania Andrew
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Software Engineer @ Material Tailwind
                    </Typography>
                  </div>
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="alexander"
                      src="https://docs.material-tailwind.com/img/face-2.jpg"
                    />
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Alexander
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Backend Developer @ Material Tailwind
                    </Typography>
                  </div>
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <Avatar
                      variant="circular"
                      alt="emma"
                      src="https://docs.material-tailwind.com/img/face-3.jpg"
                    />
                  </ListItemPrefix>
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Emma Willever
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      UI/UX Designer @ Material Tailwind
                    </Typography>
                  </div>
                </ListItem>
              </List>
            </div>
            <div className="w-full h-20 flex justify-center">
              <button
                class="rounded-lg relative w-5/6 h-10 cursor-pointer flex items-center border border-light-blue-500 bg-light-blue-500 group hover:bg-light-blue-500 active:bg-light-blue-700 active:border-light-blue-700"
                onClick={() => setOpenRight(true)}
              >
                <span class="text-white font-semibold ml-20 transform group-hover:translate-x-20 transition-all duration-300">
                  Add Company
                </span>
                <span class="absolute right-0 h-full w-10 rounded-lg bg-light-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                  <PlusIcon color="white" className="h6 w-6" />
                </span>
              </button>
            </div>
          </div>
        </Card>
        <div className="w-full">
          <Card className="w-full h-full">
            <div className="flex flex-col p-8">
              <div className="flex gap-3 w-full items-center">
                <div className="flex justify-center items-center bg-blue-600 text-white text-xl font-semibold rounded-full w-[70px] h-[70px]">
                  RE
                </div>
                <div>
                  <Typography variant="h6">Royal Enfield</Typography>
                  <Typography variant="small">@royalenfield.com</Typography>
                  <Typography>
                    <span className="font-semibold text-xs">POC: </span>
                    <span className="text-sm font-medium">
                      <a href="#">Ralph Edwards</a>
                    </span>
                  </Typography>
                </div>
              </div>
            </div>
            <hr className="text-semibold" />
            <div className="h-full p-4">
              <Tabs value={activeTab} className="h-full">
                <div className="flex">
                  <div className="w-1/3">
                    <TabsHeader
                      className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                      indicatorProps={{
                        className:
                          "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                      }}
                    >
                      {data.map(({ label, value }) => (
                        <Tab
                          key={value}
                          value={value}
                          onClick={() => setActiveTab(value)}
                          className={activeTab === value ? "text-gray-900" : ""}
                        >
                          {label}
                        </Tab>
                      ))}
                    </TabsHeader>
                  </div>
                </div>
                <TabsBody className="h-full">
                  {data.map(({ value, desc }) => (
                    <TabPanel key={value} value={value} className="h-full">
                      {desc}
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            </div>
          </Card>
          <NewCompany openRight={openRight} setOpenRight={setOpenRight} />
        </div>
      </div>
    </>
  );
};

const NewCompany = ({ openRight, setOpenRight }) => {
  const [searchCompany, setSearchCompany] = useState("");
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressCountry: "",
    addressPostal: "",
    lat: "",
    lon: "",
    phone: "",
    url: "",
    revenue: "",
    totalEmployees: "",
    yearFounded: "",
    emailPatterns: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    description: "",
  });
  const [logoUrl, setLogoUrl] = useState(
    "https://docs.material-tailwind.com/img/face-1.jpg"
  );

  const handleCompanyFetch = async () => {
    console.log(searchCompany);
    if (searchCompany !== "" && searchCompany !== undefined) {
      const companyDetails = await getCompanyDetails(searchCompany);
      if (companyDetails !== 500) {
        setCompanyDetails({
          name: companyDetails.name || " ",
          addressStreet: companyDetails.city?.address || " ",
          addressCity: companyDetails.city?.name || " ",
          addressState: companyDetails.state?.name || " ",
          addressCountry: companyDetails.country?.name || " ",
          addressPostal: companyDetails.city?.postal || " ",
          lat: companyDetails.continent?.latitude || " ",
          lon: companyDetails.continent?.longitude || " ",
          phone: companyDetails.phoneNumber || " ",
          url: companyDetails.domain || " ",
          revenue: companyDetails.revenue || " ",
          totalEmployees: companyDetails.totalEmployees || " ",
          yearFounded: companyDetails.yearFounded || " ",
          emailPatterns: " ",
          facebook: companyDetails.socialNetworks?.facebookId || " ",
          twitter: companyDetails.socialNetworks?.twitterId || " ",
          linkedin: companyDetails.socialNetworks?.linkedinIdAlpha || " ",
          description: companyDetails.description || " ",
        });
        setLogoUrl(companyDetails.logo);
      }
    } else {
      console.log("Company name is empty");
    }
  };

  return (
    <Drawer openRight={openRight} setOpenRight={setOpenRight}>
      <div className="p-2 mb-4">
        <div className="w-full inline-flex justify-center items-center">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search"
            placeholder="example.com"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
          />
          <Button
            variant="text"
            size="sm"
            className="rounded-none"
            onClick={() => handleCompanyFetch()}
          >
            <span className="text-sm">Go</span>
          </Button>
        </div>
        <Typography variant="small" className="text-[10px] italic">
          *This search return company details by using domain if found any.
        </Typography>
      </div>
      <div className="w-full h-full flex flex-col px-6 overflow-y-scroll">
        {/* <div
        class="w-12 h-12 rounded-full animate-spin
            border-2 border-solid border-blue-500 border-t-transparent"
      ></div> */}
        <div className="w-full flex flex-col justify-center items-center mb-10">
          <Avatar
            size="xxl"
            variant="circular"
            alt="companylogo"
            src={logoUrl}
            className=""
          />
          <Typography variant="small">
            @{companyDetails.url == "" ? "codetru.com" : companyDetails.url}
          </Typography>
        </div>
        <Typography
          variant="h6"
          className="w-full border-b uppercase border-slate-100 p-1 pl-0 mb-3"
        >
          General Details
        </Typography>
        <div className="w-full flex-1 mb-6">
          <div class="mb-4">
            <label class="block uppercase tracking-wide text-xs font-bold">
              Name
            </label>
            <input
              class="w-full uppercase shadow-inner p-2 border"
              type="text"
              name="name"
              placeholder="codetru"
              disabled
              value={companyDetails.name}
            />
          </div>
          <div className="w-full inline-flex gap-3 pb-4">
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                Revenue
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="revenue"
                placeholder="over-1b"
                disabled
                value={companyDetails.revenue}
              />
            </div>
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                Year Founded
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="year_founded"
                placeholder="1998"
                disabled
                value={companyDetails.yearFounded}
              ></input>
            </div>
          </div>
          <div className="w-full inline-flex gap-3 pb-4">
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                Street Address
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="address_street"
                placeholder="555 Roadrunner Lane"
                disabled
                value={companyDetails.addressStreet}
              />
            </div>
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                City
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="address_city"
                placeholder="Round Rock"
                disabled
                value={companyDetails.addressCity}
              ></input>
            </div>
          </div>
          <div className="w-full inline-flex gap-3 pb-4">
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                State
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="address_state"
                placeholder="Texas"
                disabled
                value={companyDetails.addressState}
              ></input>
            </div>
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                Country
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="address_country"
                placeholder="United States"
                disabled
                value={companyDetails.addressCountry}
              />
            </div>
          </div>
          <div className="w-full inline-flex gap-3 pb-4">
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                Postal Code
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="address_postal"
                placeholder="OL99QY"
                disabled
                value={companyDetails.addressPostal}
              ></input>
            </div>
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                Latitude
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="lat"
                placeholder="30.0455542"
                disabled
                value={companyDetails.lat}
              />
            </div>
          </div>
          <div className="w-full inline-flex gap-3 pb-4">
            <div class="flex-1">
              <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
                Longitude
              </label>
              <input
                class="w-full shadow-inner p-2 border"
                type="text"
                name="lon"
                placeholder="-99.1405168"
                disabled
                value={companyDetails.lon}
              />
            </div>
            <div class="flex-1"></div>
          </div>
        </div>
        <Typography
          variant="h6"
          className="w-full border-b uppercase border-slate-100 p-1 pl-0 mb-3"
        >
          Contact
        </Typography>
        <div className="w-full flex-1">
          <div class="mb-4">
            <label class="block uppercase tracking-wide text-xs font-bold">
              Phone
            </label>
            <input
              class="w-full shadow-inner p-2 border"
              type="tel"
              name="phone"
              placeholder="(555) 555-5555"
              disabled
              value={companyDetails.phone}
            />
          </div>
          <div class="mb-4">
            <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
              URL
            </label>
            <input
              class="w-full shadow-inner p-2 border"
              type="url"
              name="url"
              placeholder="codetru.com"
              disabled
              value={companyDetails.url}
            />
          </div>
          <div class="mb-4">
            <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
              Email
            </label>
            <input
              class="w-full shadow-inner p-2 border"
              type="email"
              name="email"
              placeholder="contact@codetru.com"
              disabled
              value={companyDetails.email}
            />
          </div>
        </div>
        <Typography
          variant="h6"
          className="w-full border-b uppercase border-slate-100 p-1 pl-0 mb-3"
        >
          Social
        </Typography>
        <div className="w-full flex-1">
          <div class="flex-1 mb-3">
            <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
              Facebook
            </label>
            <div class="w-full flex">
              <span class="text-xs w-1/5 py-4 px-2 bg-grey-light text-grey-dark">
                facebook.com/
              </span>
              <input
                class="flex-1 shadow-inner p-2 border"
                type="text"
                name="facebook"
                placeholder="acmeco"
                disabled
                value={companyDetails.facebook}
              />
            </div>
          </div>
          <div class="flex-1 mb-3">
            <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
              Twitter
            </label>
            <div class="w-full flex">
              <span class="text-xs w-1/5 py-4 px-2 bg-grey-light text-grey-dark">
                twitter.com/
              </span>
              <input
                class="flex-1 shadow-inner p-2 border"
                type="text"
                name="instagram"
                placeholder="acmeco"
                disabled
                value={companyDetails.twitter}
              />
            </div>
          </div>
          <div class="flex-1 mb-4">
            <label class="block uppercase tracking-wide text-charcoal-darker text-xs font-bold">
              Linkedin
            </label>
            <div class="w-full flex">
              <span class="text-xs w-1/5 py-4 px-2 bg-grey-light text-grey-dark">
                Linkedin.com/
              </span>
              <input
                class="flex-1 shadow-inner p-2 border"
                type="text"
                name="instagram"
                placeholder="acmeco"
                disabled
                value={companyDetails.linkedin}
              />
            </div>
          </div>
        </div>
        <Typography
          variant="h6"
          className="w-full border-b uppercase border-slate-100 p-1 pl-0 mb-3"
        >
          Description
        </Typography>
        <div className="w-full flex-1">
          <textarea
            class="w-full shadow-inner p-4 border resize-none"
            placeholder="We build fine acmes."
            rows="6"
            disabled
            value={companyDetails.description}
          ></textarea>
        </div>
      </div>
      <div className="px-6 py-4 flex justify-end">
        <Button color="light-blue" size="md" variant="filled">
          Save
        </Button>
      </div>
    </Drawer>
  );
};

export default Contacts;
