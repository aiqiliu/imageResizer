import urllib3
http = urllib3.PoolManager()

# Login to https://websso.it.northwestern.edu/amserver/UI/Login"
# Look the console for document.cookie 

tokenid= "<<<SSO_SESSION GOES HERE>>>>"
if tokenid == "":
	sys.exit("Not logged in")
posturl = "https://websso.it.northwestern.edu:443/amserver/identity/isTokenValid"
posturl+= "?tokenid=" + tokenid
print url
postreq = http.request('POST', posturl, headers={'Content-Type':'application/json'}, body={})
print postreq.data

loginStat = postreq.data

if loginStat == "false":
	sys.exit("Not logged in")
### Exchange SSO token for NETID
# GET https://websso.it.northwestern.edu:443/amserver/identity/attributes?subjectid=<<insert-sso-token-here>>&attributenames=AuthType&attributenames=uid"
#replace subjectid value with the session
geturl = "https://websso.it.northwestern.edu:443/amserver/identity/attributes?subjectid=<<" + tokenid + ">>&attributenames=AuthType&attributenames=uid"
getreq = http.request('GET', geturl, headers={'Content-Type':'application/json'}, body={})

#get netID for autorizaiton

authorizedID = ["alc342"]