<template>

  <div>
    <div>
      <NuxtLink to="/applications?type=basic">Basic Apply</NuxtLink>
    </div>
    <div>
      <NuxtLink to="/applications?type=standard">Standard Apply</NuxtLink>
    </div>
    <div>
      <NuxtLink to="/applications?type=enhanced">Enhanced Apply</NuxtLink>
    </div>

  </div>




</template>

<script setup>

import {z} from 'zod/v4'
import {toTypedSchema} from "@vee-validate/zod";

const schema = z.object({
  foo: z.array(z.object({
    title: z.string().nonempty('Required')
  }))
}).refine((data) => {
  return data.foo.length > 2
}, {
  message: 'At least one item is required',
  path: ['foo'],
  when: () => true,
})

const { push, fields } = useFieldArray('foo.bar', undefined, {})

</script>
