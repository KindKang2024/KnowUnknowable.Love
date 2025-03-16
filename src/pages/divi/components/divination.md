


Given 49 items of wills, like 49 particles

first round division them into  2 parts: yin and yang

we got yang numbers, so we could know the yin numbers since it equals all - yang numbers


first let take one from yin part out, make it an human_reminder 
then for each part, group them by 4 and take each group out, the last group should be left treat as yin_reminder and yang_reminder . the groups that taken out should be used for the second round division.

second round division them into  2 parts: yin and yang
do the same about process

third round division again and do the same process

In the end,  there should have certain numbers of items left

I want to record this process by using three numbers , that is each round yin_number and derive all the reminder number for each round and also for the final number of items.

Could you create an typescript script to create an class for named 
YAO



Based on the YAO, we should construct a structure named Gua

It should also have at least two factory method , createFrom6Yao, or createEmpty

It should also have addYao method, when its length ===6, it is completed

As it add, it should derive an number 0/1 array for it.
that is yao.getFinalUndividedGroupCount() % 2 
you all add an mutationArr which is a bool, its value depends  yao.getFinalUndividedGroupCount() == 6 or  yao.getFinalUndividedGroupCount()  == 9

