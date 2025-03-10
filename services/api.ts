const API_BASE = "https://api.teknohive.me"

export async function deleteMessage(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/message/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error(`Failed to delete message: ${res.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting message:", error)
    throw error
  }
}

export async function deleteSongfess(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/songfess/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error(`Failed to delete songfess: ${res.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting songfess:", error)
    throw error
  }
}

export async function fetchMessages() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/messages`, {
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    
    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      // Handle text response
      const text = await response.text();
      console.log("Received text response:", text);
      // Return empty array or default structure
      return { messages: [] };
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function fetchSongfess() {
  try {
    // First try the primary endpoint
    const response = await fetch(`${API_BASE}/api/admin/songfessAll`, {
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    })

    if (!response.ok) {
      console.log("Primary songfess endpoint failed, trying fallback...")
      
      // If first endpoint fails, try the fallback endpoint
      const fallbackResponse = await fetch(`${API_BASE}/api/admin/songfess`, {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      })
      
      if (!fallbackResponse.ok) {
        throw new Error("Failed to fetch songfess from both endpoints")
      }
      
      return await fallbackResponse.json()
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching songfess:", error)
    throw error
  }
}

