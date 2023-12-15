import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "8f4fd84b-1472-4d01-9dad-651f649f71df",
        authority: "https://login.microsoftonline.com/9662a564-79fa-428f-847f-afd002a15c70",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "localStorage", 
        storeAuthStateInCookie: true, 
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};

export const loginRequest = {
    scopes: ["User.Read", "IMAP.AccessAsUser.All"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
