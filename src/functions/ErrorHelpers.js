//These functions are not currently being used. Will attempt to implement them at a later date.
function checkStatusCode(request, statusCode) {
  if (request.status === statusCode) {
    return true
  }
}

export function checkRequestStatus(request) {
  if (checkStatusCode(request, 200)) {
    return request
  }
  if (checkStatusCode(request, 400)) {
    return {
      error: 400,
      message: "There appears to be an error with your request, please try again."
    }
  }
  if (checkStatusCode(request, 401)) {
    return {
      error: 401,
      message: "You are not properly authenticated. Please try authenticating with Bungie again."
    }
  }
  if (checkStatusCode(request, 403)) {
    return {
      error: 403,
      message: "You do not have access to this information. Double check that your information is correct and try again."
    }
  }
  if (checkStatusCode(request, 408)) {
    return {
      error: 408,
      message: "Your request timed out. Please check your internet connetion and try again."
    }
  }
  if (checkStatusCode(request, 500)) {
    return {
      error: 500,
      message: "The Bungie API cannot process your request at this time. Please try again later."
    }
  }
}