import { env } from "@env";
import { createId } from "@paralleldrive/cuid2";


export function GenerateLinks(url: string | URL, redirect?: string, id?: string) {
  const code = createId();

  const Link = new URL(`${url}`, env.BASE_URL);

  Link.searchParams.set("code", code);
  Link.searchParams.set("redirect", `${redirect}`);

  if(id) {
    Link.searchParams.set("id", id)
    return { Link, code, id }
  }
  
  return { Link, code };

  // return { Link, code };
}