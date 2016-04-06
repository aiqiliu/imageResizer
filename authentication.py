import urllib3
import sys
http = urllib3.PoolManager()

# Login to https://websso.it.northwestern.edu/amserver/UI/Login"
# Look the console for document.cookie 

tokenid= "AQIC5wM2LY4Sfcwii1j1jMJT2qDaa_xbWSngDSwNthGwXqc.*AAJTSQACMDYAAlNLABMxNTIzMzMwMjM4Mzg4NzQ0MTA5AAJTMQACMDI.*"
if tokenid == "":
	sys.exit("Not logged in")
posturl = "https://websso.it.northwestern.edu:443/amserver/identity/isTokenValid"
posturl+= "?tokenid=" + tokenid
print posturl
postreq = http.request('POST', posturl, headers={'Content-Type':'application/json'}, body={})
#print postreq.data
index = postreq.data.find('=') + 1

#grab true/false after the equation symbol
loginStat = postreq.data[index:]
print loginStat

if loginStat == "false":
	sys.exit("Not logged in")
else:
	print "You're logged in!"
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
	print "Congrats! you have access to this service!"
else:
	sys.exit("Sorry you don't have access to this service")
