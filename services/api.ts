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
    const response = await fetch(`${API_BASE}/messages`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch messages")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}

export async function fetchSongfess() {
  try {
    const response = await fetch(`${API_BASE}/songfess`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch songfess")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching songfess:", error)
    throw error
  }
}

