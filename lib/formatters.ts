export const queryStringFormatter = (
  params: Record<string, string | string[] | undefined>
): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const formatDateTime = (dateString?: string | Date): string => {
  if (!dateString) return "N/A";
  
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return "N/A";
  
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getInitials = (name: string): string => {
  if (!name) return "";
  
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};