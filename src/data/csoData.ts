import type { Subject } from '../types/course';
import { csoCh1to5 } from './csoCh1to5';
import { csoCh6to9 } from './csoCh6to9';

export const csoSubject: Subject = {
  id: 'cso',
  code: 'ITCF0013',
  name: 'Computer System Organization',
  shortName: 'CSO',
  tagline: 'System buses, memory hierarchy, CPU registers, number base & 2s complement arithmetic, Boolean logic, MARIE ISA, I/O interrupts, and parallel pipelining.',
  pastel: 'blue',
  totalFiles: '9 PDFs + 2 PPTXs',
  totalVolume: '435 Slides',
  instructorOrSource: 'UNITAR International University (ITCF0013)',
  masterKeywords: [
    'Von Neumann Architecture', 'Harvard Architecture', 'CISC vs. RISC',
    'System Bus (Address / Data / Control)', 'USB / PCIe / SATA / SCSI',
    'Memory Hierarchy', 'Cache Hit & Miss', 'Temporal & Spatial Locality',
    'DRAM vs. SRAM', 'RAID (Striping & Parity)', 'NAND Flash SSD vs. HDD',
    'PC / IR / MAR / MBR / SP', 'Status Flags (Z, C, V, N)',
    'Fetch-Decode-Execute Cycle', 'Indirect & Interrupt Cycles',
    'Base 2 / 8 / 10 / 16 Conversions', '1s & 2s Complement', 'Signed Overflow',
    'Boolean Precedence (NOT-AND-OR)', 'NAND & NOR Universal Gates',
    'Truth Tables & Propagation Delay', 'MARIE ISA & Expanding Opcodes',
    'Big vs. Little Endian', 'Seven Addressing Modes (EA)',
    'Interrupt Latency & ISR', 'Programmed vs. Memory-Mapped vs. Isolated I/O',
    'DMA Cycle Stealing', 'SMP & MESI Cache Coherence', 'NUMA & Clusters',
    'Flynn Taxonomy (SISD/SIMD/MISD/MIMD)', 'Amdahl Law', '6-Stage Pipelining',
  ],
  labTitle: 'Base/2s Complement, Boolean Truth Table & Pipeline Lab',
  labDescription: 'Step-by-step radix converter (Base 2/8/10/16), 8-bit signed arithmetic inspector, Boolean expression evaluator, and Amdahl/Pipeline speedup simulator.',
  chapters: [...csoCh1to5, ...csoCh6to9],
};
