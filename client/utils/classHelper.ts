export const getTicketPriority = (priority: string | undefined) => {
  if (!priority) return '';

  switch (priority.toLowerCase()) {
    case "low":
      return "bg-blue-500 text-blue-50 ring-blue-500/30";
    case "medium":
      return "bg-orange-500 text-white ring-orange-500/30";
    case "high":
      return "bg-red-500 text-red-50 ring-red-500/30";
    default:
      return "bg-gray-500 text-gray-50 ring-gray-500/30";
  }
};

export const getTicketStatus = (status: string | undefined) => {
  if (!status) return '';

  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-500 text-blue-50 ring-blue-500/30";
    case "open":
      return "bg-blue-500 text-blue-50 ring-blue-500/30";
    case "in progress":
      return "bg-orange-500 text-orange-50 ring-orange-500/30";
    case "resolved":
      return "bg-green-500 text-green-50 ring-green-500/30";
    case "closed":
      return "bg-red-500 text-red-50 ring-red-500/30";
    default:
      return "bg-gray-500 text-gray-50 ring-gray-500/30";
  }
};