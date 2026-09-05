# Template: R2 size decision

object_size_mib: 0

if:
  object_size_mib <= 5120:
    upload: single PUT
    note: "Single-part upload max is 5 GiB."
  object_size_mib > 5120:
    upload: multipart
    part_size_mib:
    part_count:
    final_part_may_be_small: true

multipart_checks:
  part_size_mib_at_least_5_except_final: true
  part_count_at_most_10000: true
  same_size_nonfinal_parts: true

operation_budget:
  create_multipart:
  upload_parts:
  complete_multipart:
  expected_class_a:
  expected_class_b:
