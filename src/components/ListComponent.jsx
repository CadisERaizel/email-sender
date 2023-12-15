import React from 'react'
import {
    List,
    ListItem,
    Typography
} from "@material-tailwind/react";

const ListComponent = (props) => {
    var campaigns = props.campaigns
    var isCampaigns = props.isCampaigns
    var emails = props.emails
    console.log(emails)
    return (
        <>
            {isCampaigns ? (
                <div><List className='min-w-0'>
                    {campaigns.campaignList.map((campaign) => (
                        <ListItem className='rounded-none py-1.5 px-3 text-sm font-normal text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white' id={campaign.id} onClick={(e) => {
                            console.log(e.target.id)
                        }}>
                            <div id={campaign.id} className='flex gap-4 w-full'>
                                <div id={campaign.id} className='flex flex-col'>
                                    <Typography id={campaign.id} variant='small' className='text-xs'>{campaign.start_date}</Typography>
                                    <Typography id={campaign.id} variant='small' className='text-xs'>{campaign.start_time.split(".")[0]}</Typography>
                                </div>
                                <div id={campaign.id} className='self-center'>
                                    <Typography id={campaign.id} variant='h6' className='text-sm' >{campaign.campaign_name}</Typography>
                                </div>
                            </div>
                        </ListItem>
                    ))}
                </List></div>) : (
                <div><List className='min-w-0'>
                    {emails.emailsOpenedList.map((email) => (
                        <ListItem className='rounded-none py-1.5 px-3 text-sm font-normal text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white' id={email.id} onClick={(e) => {
                            console.log(e.target.id)
                        }}>
                            <div id={email.id} className="flex flex-col">
                                <Typography id={email.id} variant='h6' className='text-md pb-1'>{email.email}</Typography>
                                <Typography id={email.id} variant='small' className='text-xs'>{" "}Subject: {email.subject}</Typography>
                            </div>
                        </ListItem>
                    ))}
                </List></div>
            )
            }
        </>
    )
}

export default ListComponent