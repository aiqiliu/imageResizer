import urllib3
import sys
http = urllib3.PoolManager()

# Login to https://websso.it.northwestern.edu/amserver/UI/Login"
# Look the console for document.cookie 

tokenid= "AQIC5wM2LY4fcxAeMZjQZB86ENMKgw1snnympGSF2Sa5ag.*AAJTSQACMDYAAlNLABIyMTQ3Mjc1ODY0OTIwNTg3MjIAAlMxAAIwMQ..*"
if tokenid == "":
	sys.exit("Not logged in")

posturl = "https://websso.it.northwestern.edu:443/amserver/identity/isTokenValid"
posturl+= "?tokenid=" + tokenid

postreq = http.request('POST', posturl, headers={'Content-Type':'application/json'}, body={})
print postreq.data

#grab true/false of login status
index = postreq.data.find('=') + 1
loginStat = postreq.data[index:]
print "Login status is: " + loginStat.rstrip()

if loginStat.rstrip() == "false":
	print "Not logged in"
	sys.exit()
else:
	print "You're logged in!"
# sys.exit()
### Exchange SSO token for NETID
# GET https://websso.it.northwestern.edu:443/amserver/identity/attributes?subjectid=<<insert-sso-token-here>>&attributenames=AuthType&attributenames=uid"
#replace subjectid value with the session
geturl = "https://websso.it.northwestern.edu:443/amserver/identity/attributes?subjectid=" + tokenid + "&attributenames=AuthType&attributenames=uid"
getreq = http.request('GET', geturl, headers={'Content-Type':'application/json'}, body={})
#print getreq.data
#get netID for autorizaiton
lineIndex = getreq.data.find('userdetails.attribute.value')
substr = getreq.data[lineIndex:]
netIDIndex = substr.find('=') + 1
substr = substr[netIDIndex:]
netID = substr[:6]
print "Your netID is: " + netID

#check if logged in netID is authorized 
authorizedID = ["alc342"]
if netID in authorizedID:
	print "Congrats! you have access to this service."
else:
	sys.exit("Sorry you don't have access to this service")
