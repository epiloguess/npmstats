

import {fetcher} from '@/_libs/func'
import { MDXRemote } from 'next-mdx-remote/rsc'

import MdxLayout from '@/_component/MdxLayout'


export default async function App({ pkg_name }) {

    const result = await fetch(`https://registry.npmjs.org/${pkg_name}`,{
        headers: {
            'Accept': 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*', // 设置 Accept 头部为 application/json
            // 其他头部...
          }
    })

    const data = await result.json()

    return (
        <MdxLayout>
        <MDXRemote source={data.readme} />
        </MdxLayout>
    );
}
