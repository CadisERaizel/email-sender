import React, { useEffect, useState } from "react";
import { dateFomatter, getInitials } from "../utils/common";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  PaperAirplaneIcon,
  TrashIcon,
  ArchiveBoxIcon,
  PencilSquareIcon,
  ArchiveBoxXMarkIcon,
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMailStore, useBoardStore } from "../states";
import DOMPurify from "dompurify";

const InboxScreen = () => {
  const mails = useMailStore();
  const [selectedMail, setSelectedMail] = useState(null);

  useEffect(() => {
    const fetchMails = async () => {
      await mails.fetchInbox();
    };

    fetchMails();
  }, []);

  return (
    <div className="flex h-full">
      <div className="min-w-[19rem]">
        <MailFolders />
      </div>
      <div className="min-w-[24rem]">
        <MailList setSelectedMail={setSelectedMail} />
      </div>
      <div className="w-full h-full">
        <EmailDisplayLayout selectedMail={selectedMail} />
      </div>
    </div>
  );
};

function MailFolders() {
  return (
    <Card className="h-[calc(100vh-100px)] w-full max-w-[20rem] p-4 pr-0 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Folders
        </Typography>
      </div>
      <List>
        <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <PencilSquareIcon className="h-5 w-5" />
          </ListItemPrefix>
          Draft
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <ArchiveBoxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Archive
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <PaperAirplaneIcon className="h-5 w-5" />
          </ListItemPrefix>
          Sent
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <TrashIcon className="h-5 w-5" />
          </ListItemPrefix>
          Deleted Items
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <ArchiveBoxXMarkIcon className="h-5 w-5" />
          </ListItemPrefix>
          Junk Email
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Bars3CenterLeftIcon className="h-5 w-5" />
          </ListItemPrefix>
          Conversation History
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix>
        </ListItem>
      </List>
    </Card>
  );
}

function MailList(props) {
  const setSelectedMail = props.setSelectedMail;
  const mails = useMailStore();
  const [hasMore, setHasMore] = useState(true);
  return (
    <Card className="h-[calc(100vh-100px)] w-full max-w-[24rem] p-4 pr-0 shadow-xl shadow-blue-gray-900/5">
      <div className="p-2">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search"
        />
      </div>
      <List id="scrollableDiv" className="overflow-y-scroll">
        <InfiniteScroll
          dataLength={mails.inbox.mails.length}
          next={() => {
            mails.fetchNextLink();
          }}
          hasMore={hasMore}
          loader={<p>Loading ....</p>}
          scrollableTarget="scrollableDiv"
        >
          {mails.inbox.mails.map((mail, index) => {
            return (
              <ListItem
                className="relative"
                key={mail.id}
                onClick={() => {
                  setSelectedMail(index);
                }}
              >
                <ListItemPrefix>
                  <div className="flex justify-center items-center bg-blue-600 text-white text-lg rounded-full w-[50px] h-[50px]">
                    {getInitials(mail.sender.emailAddress.name)}
                  </div>
                </ListItemPrefix>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-md">
                    {mail.sender.emailAddress.name}
                  </span>
                  <div className="flex justify-between gap-1">
                    <span className="text-sm truncate">{mail.subject}</span>
                    <span className="text-sm">
                      {dateFomatter(mail.sentDateTime, "day")}
                    </span>
                  </div>
                  <span className="text-xs w-full truncate">
                    {mail.bodyPreview}
                  </span>
                </div>
                {mail.isRead ? null : (
                  <ListItemSuffix className="pl-1">
                    <div className="absolute top-1/2 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                  </ListItemSuffix>
                )}
              </ListItem>
            );
          })}
        </InfiniteScroll>
      </List>
    </Card>
  );
}

function EmailDisplayLayout({ selectedMail }) {
  const mails = useMailStore();
  const board = useBoardStore();

  const handleTicketAdd = () => {
    board.addTicket()
  }
  const email = selectedMail == null ? null : mails.getMailData(selectedMail);
  const emailBody = email ? email.body.content : null;
  const emailSubject = email ? email.subject : null;
  const sanitizedHTML = DOMPurify.sanitize(emailBody);

  return (
    <>
      {email ? (
        <div className="flex flex-col p-4 h-full">
          <div className="flex flex-col gap-2 py-4">
            <div className="flex justify-between w-full items-center">
              <span className="text-md font-semibold">{emailSubject}</span>
              <IconButton
                size="sm"
                variant="outlined"
                color="amber"
                className="rounded-sm border-none"
                onClick={handleTicketAdd}
              >
                <DocumentPlusIcon className="h-5 w-5" />
              </IconButton>
            </div>
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <div className="flex justify-center items-center bg-blue-600 text-white text-lg rounded-full w-[50px] h-[50px]">
                  {getInitials(email.sender.emailAddress.name)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {email.sender.emailAddress.name}
                  </span>
                  <span className="text-sm font-semibold">
                    To:{" "}
                    {email.toRecipients.map((recipient) => {
                      return <>{recipient.emailAddress.name}{recipient.emailAddress.length > 1 ? ',' : null}</>;
                    })}
                  </span>
                </div>
                <span className="self-center">
                  {"<"}
                  {email.sender.emailAddress.address}
                  {">"}
                </span>
              </div>
              <span className="self-center text-xs">
                {dateFomatter(email.sentDateTime, "full")}
              </span>
            </div>
          </div>
          <div className="h-full overflow-scroll">
            <Email sanitizedHTML={sanitizedHTML} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function Email({ sanitizedHTML }) {
  return (
    <>
      {sanitizedHTML == null ? null : (
        <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      )}
    </>
  );
}

export default InboxScreen;
